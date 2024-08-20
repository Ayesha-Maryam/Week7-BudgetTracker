import { useEffect, useState } from "react";
import { format } from "date-fns";
import AddBudget from "./BudgetForm";
import "./ShowBudget.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import BudgetChart from "./BudgetChart";

export default function ShowBudget({
  addBudget,
  entries,
  setEntries,
  users,
  limit,
}) {
  const [updatedEntry, setUpdatedEntry] = useState({});
  const [filterDate, setFilterDate] = useState(new Date());
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [modalOpen, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);

  useEffect(() => {
    console.log('entries changes')
    axios.get(`http://localhost:8080/budgetEntries/${users._id}`, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      })
      .then((response) => {
        console.log({ reponse: response.data });
        setFilteredEntries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [users._id, entries]);


  useEffect(() => {
    console.log("Date Changed.", { entries });
     filterByDate(filterDate);
    
  }, [filterDate]);

  const handleDelete = async (id) => {
    const newEntries = entries.filter((entry) => entry._id !== id);
    try {
      const response = await axios.delete(
        `http://localhost:8080/budgetEntries/${id}`);
      if (!response) {
        throw new Error("Cannot fetch Data");
      }
      setEntries(newEntries);
      
      setFilteredEntries(newEntries);
      
      toast.success("Entry Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id) => {
   
    setEditId(id);
  const entryToEdit = entries.find((en) => en._id === id);
  setUpdatedEntry({
    ...entryToEdit,
    date: entryToEdit?.date ? new Date(entryToEdit.date) : new Date(), 
  });
  };

  const handleSave = async () => {
    const updatedEntries = entries.map((entry) =>
      entry._id === editId
        ? { ...updatedEntry, date: new Date(updatedEntry.date) } 
        : entry
    );

    try {
      const response = await axios.put(
        `http://localhost:8080/budgetEntries/${editId}`,
        {
          name:updatedEntries.name,
          price: updatedEntries.price,
          date: updatedEntries.date,
        }
      );
      if (!response) {
        throw new Error("Cannot Fetch Data");
      }
      setEntries(updatedEntries);
      setFilteredEntries(updatedEntries);
      toast.success("Budget Entry Edited");
      
    } catch (error) {
      console.log(error);
    }

    setEditId(null);
  };

  async function filterByDate (newDate) {
    const filtered = entries.filter((en) => {
      return new Date(en.date).toDateString() === newDate.toDateString();
    });
    setFilteredEntries(filtered);
    
  };

  const currentRows = filteredEntries.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      if (direction === "next" && prevPage < totalPages) {
        return prevPage + 1;
      } else if (direction === "prev" && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  const handleRowsPerPageChange = (e) => {
    const value = Number(e.target.value);
    if (value > 0 && value <= filteredEntries.length) {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  };

  return (
    <div className="container-1">
      <div className="container2">
        <h3>Filter By Date</h3>
        <div className="filter">
          <input
            value={format(filterDate, "yyyy-MM-dd")}
            type="date"
            onChange={(e) => setFilterDate(new Date(e.target.value))}
          />
          <button
            className="filter-btn"
            onClick={() => filterByDate(filterDate)}
          >
            Filter Records
          </button>
          <button
            className="filter-btn"
            onClick={() => setFilteredEntries(entries)}
          >
            Reset Filter
          </button>

          <button className="add-btn" onClick={() => setModal(true)}>
            Add Budget
          </button>
        </div>
        <table className="budget-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((en) => (
              <tr key={en._id}>
                <td>
                  {editId === en._id ? (
                    <input
                      value={updatedEntry.name}
                      type="text"
                      onChange={(e) =>
                        setUpdatedEntry({
                          ...updatedEntry,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    en.name
                  )}
                </td>
                <td>
                  {editId === en._id ? (
                    <input
                      value={updatedEntry.price}
                      type="number"
                      onChange={(e) =>
                        setUpdatedEntry({
                          ...updatedEntry,
                          price: e.target.value,
                        })
                      }
                    />
                  ) : (
                    en.price
                  )}
                </td>
                <td>
                  {editId === en._id ? (
                    <input
                    value={updatedEntry.date ? format(new Date(updatedEntry.date), "yyyy-MM-dd") : ""}
                      type="date"
                      onChange={(e) =>
                        setUpdatedEntry({
                          ...updatedEntry,
                          date: e.target.value,
                        })
                      }
                    />
                  ) : (
                    en.date ? format(new Date(en.date), "yyyy-MM-dd") : "Invalid Date"
                  )}
                </td>
                <td>
                  {editId === en._id ? (<div className="action-menu">
                    <button className="save" onClick={handleSave}>Save</button>
                    <button className="delete" onClick={()=>
                      {
                        setEditId(null);   
                        setUpdatedEntry({});
                      }
                    }>Cancel</button>
                    </div>) : (
                    <div className="action-menu">
                      <button className='edit' onClick={() => handleEdit(en._id)}>Edit</button>
                      <button className="delete" onClick={() => handleDelete(en._id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-controls">
          <div className="select-rows">
            <label>
              Rows per page:
              <input
                type="number"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                min="1"
                max={filteredEntries.length}
              />
            </label>
          </div>
          <div className="pages">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <span>
              {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                currentPage * rowsPerPage,
                filteredEntries.length
              )} of ${filteredEntries.length}`}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
        <div className="chart">
        <BudgetChart entries={entries} budgetLimit={limit} />
      </div>
        {modalOpen && (
          <AddBudget
            entries={entries}
            addBudget={addBudget}
            limit={limit}
            modal={modalOpen}
            setModal={setModal}
          />
        )}

        <ToastContainer />
      </div>
      
    </div>
  );
}
