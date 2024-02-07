import React, { useEffect, useState } from "react";
import { BsArrowUp, BsArrowDown, BsPencilSquare } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineArrowBackIosNew, MdDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { TiWarning } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { PiUserCircleFill } from "react-icons/pi";

const EmployeeList = () => {

  // get employee_list and store in array array formate.
  const [empDetails, setEmpDetails] = useState({
    employeeList: [],
  });

  // -------------------------------------------------------------No of page show down in the table. ------------------------------------------

  // set the column in ascending and descending order.
  const [sortConfig, setSortConfig] = useState({
    column: "",
    direction: "ascending",
  });

  // Set adding page based on the table rows .
  const [currentPage, setCurrentPage] = useState(1);

  // Search Query for searching employees by employee name , code and country.
  const [searchQuery, setSearchQuery] = useState("");

  // function for the column will set ascending or descending order based on direaction.
  const onSort = (key) => {
    let direction = "ascending";
    if (sortConfig.column === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ column: key, direction });
  };

  // All data will be change based on there condition of ascending and descending.
  const sortedEmployeeList = [...empDetails.employeeList].sort((a, b) => {
    if (sortConfig.direction === "ascending") {
      return a[sortConfig.column] > b[sortConfig.column] ? -1 : 1;
    } else {
      return a[sortConfig.column] < b[sortConfig.column] ? -1 : 1;
    }
  });

  // filder the data from the table using search query .
  const filteredEmployeeList = sortedEmployeeList.filter((item) => 
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // number of row in the  employee list table
  const [itemsPerPage, setitemsPerPage] = useState(10);

  // calculate how many pages are needed by dividing total number of records with per page count.
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredEmployeeList.slice(startIndex, endIndex);

  // total number of page based on their row 
  const totalPages = Math.ceil(filteredEmployeeList.length / itemsPerPage);

  // -------------------------------------------------------------No of page show down in the table. ------------------------------------------

  // This function will be in fetch the api from the server to get the data from the database.

  useEffect(() => {
    const getEmpList = async () => {
      try {
        let response = await fetch(
          "http://localhost:4000/api/get_employee_table_list"
        );
        // response is not success it will throw an error.
        if (response.status !== 200) {
          throw new Error("Error in getting employee details");
        }
        // wait and get the new data and update the field
        const newData = await response.json();
        setEmpDetails({ employeeList: newData });
      } catch (error) {
        console.log(`Error ${error}`);
      }
    };
    getEmpList();
  }, []);

  // ---------------------------------------------- Page handle next and back btn -------------------------------------------------------------

  //  Function for handling page , sorting and searching functionality.
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // function for previous page
  const goBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // function for next page
  const goNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // ---------------------------------------------- Page handle next and back btn -------------------------------------------------------------

  //--------------------------------------------- No. of row present in the row ----------------------------------------------------------------

  // page filter based on reacords and rowscontrol
  const handlePageFilter = (selectedRowsPerPage) => {
    setitemsPerPage(selectedRowsPerPage);
    setCurrentPage(1); // Reset to the first page when changing the number of rows per page
  };

  // handle the records in ascending or descending  

  const renderSorting = (column) => {
    if (sortConfig.column === column) {
      return sortConfig.direction === "ascending" ? (
        <BsArrowDown className="my-auto" />
      ) : (
        <BsArrowUp className="my-auto" />
      );
    }
    return null;
  };

  //--------------------------------------------- No. of row present in the row ----------------------------------------------------------------

  // -------------------------------------------------------- PopUp ------------------------------------------------------------------------


  // Popup states function for delete button
  const [showPopup, setShowPopup] = useState(false);

  // popup function is Open props
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // popup for update button
  const [updatePopup, setUpdatePopup] = useState(false);

  const updatePopups = () => {
    setUpdatePopup(!updatePopup);
  };

  // view function

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Function to handle the "View" button click
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
  };
  // ------------------------------------- PopUp ------------------------------------------------------------------------

  // delete employee from database using employee Id 

  const deleteUser = async (employee_id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/detele_employee_table_list/${employee_id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        const updatedEmployeeList = empDetails.employeeList.filter(
          (item) => item.employee_id !== employee_id
        );
        // window.location.reload();
        console.log("employee deleted Successfully");

        // Update the state with the new employee list
        setEmpDetails({ employeeList: updatedEmployeeList });
      } else {
        console.log("Deleting issuse");
      }
    } catch (error) {
      console.error(error, "server Error");
    }
  };

  // Update the  Employee List in State when a user click on Edit Button

  const [formData, setFormData] = useState({
    employee_name: "",
    country_id: "",
  });

  // User edit the information and update to the database.
  const [userToEdit, setUserToEdit] = useState(null);

  // after edit the information the data updated to the database submit function.
  const handleUpdateSubmit = async () => {
    // e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:4000/api/update_employee_table_list/${userToEdit.employee_id}`,
        {
          // put method is used for updating the data.
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // All data should be in json format.
          body: JSON.stringify({
            employee_id: userToEdit.employee_id,
            employee_code:userToEdit.employee_code,
            employee_name: formData.employee_name,
            country_id: formData.country_id,
          }),
        }
      );

      // updated response is success it will updated.

      if (response.status === 200) {
        console.log("User data updated successfully");
        window.location.reload();
        setFormData({
          employee_name: "",
          country_id: "",
        });
        fetchData();
        setUpdatePopup(false);
      } else {
        console.error("User data update failed");
      }
    } catch (error) {
      console.error("Error user data update:", error);
    }
  };

  // employee details get and fetch the date user can update the details
  
  const fetchData = async () => {
    try {
      let response = await fetch(
        "http://localhost:4000/api/get_employee_details"
      );

      if (response.status !== 200) {
        throw new Error("Error in getting employee details");
      }

      const newData = await response.json();
      setEmpDetails({ employeeList: newData });
    } catch (error) {
      console.log(`Error ${error}`);
    }
  };

  // All data should be loaded when component mounts, so useEffect to call function on component mount.

  useEffect(() => {
    fetchData();
  }, []);

  // Assigning values from props to state for initial render.
  const [countryName, setCountryName] = useState([{ id: "", name: "" }]);

  // Fetch the data from database in country table.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/country_list");
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const newData = await response.json();
        setCountryName(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  
  // const [isButtonDisabled, setButtonDisabled] = useState(false);

  // disable the button will be false.  
  // const disableButton = () => {
  //   setButtonDisabled(false);
  // };


  return (
    <div className="bg-[#072E33] h-screen overflow-auto">
      <div className="grid max-w-[1140px] mx-auto">
        <div className="my-10">
          <div className="flex justify-between bg-[#0F969C] p-3 my-auto border-black border-[1px]">
            <h1 className="text-2xl font-bold text-white select-none">
              Employee List
            </h1>
            <div className="flex my-auto rounded-md">
              {/* search the employee list from the table */}
              <input
                type="text"
                className="p-1 focus:outline-none"
                name="Search"
                id=""
                placeholder="Search Employee List"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="text-white p-1 bg-[#0c7075]"
                onClick={() => setSearchQuery("")}
              >
                <IoMdSearch size={25} />
              </button>
            </div>

            <div className="flex gap-5">
              <div className="flex my-auto ">
                <select
                  id="pageSelector"
                  value={itemsPerPage}
                  className="p-1 rounded-md w-12"
                  onChange={(e) => handlePageFilter(Number(e.target.value))}
                >
                  {[5, 10, 20, 50].map((rows) => (
                    <option key={rows} value={rows}>
                      {rows}
                    </option>
                  ))}
                </select>
              </div>

              <a
                href="/employee_details"
                className="text-white bg-[#0c7075] p-2 rounded-md"
              >
                Add Employee
              </a>
            </div>
          </div>

          {/* Table for header name of columns */}
          <table className="w-full">
            <thead className="bg-[#0c7075] text-white">
              <tr className="text-center">
                <th>S.NO</th>
                <th
                  className="border-[1px] border-black w-52 p-2 cursor-pointer"
                  onClick={() => onSort("employee_code")}
                >
                  <div className="flex justify-center gap-1">
                    Employee Code
                    {renderSorting("employee_code")}
                  </div>
                </th>
                <th
                  className="border-[1px] border-black p-2 cursor-pointer"
                  onClick={() => onSort("employee_name")}
                >
                  <div className="flex justify-center gap-1 ">
                    Employee Name
                    {renderSorting("employee_name")}
                  </div>
                </th>
                <th
                  className="border-[1px] border-black p-2 cursor-pointer"
                  onClick={() => onSort("country_name")}
                >
                  <div className="flex justify-center gap-1">
                    Country Name
                    {renderSorting("country_name")}
                  </div>
                </th>
                <th className="border-[1px] w-1/4 border-black p-2 select-none">
                  Action
                </th>
              </tr>
            </thead>

            {/* Getting all data show in the table formate */}
            <tbody className="text-center">
              { currentItems.map((item , index) => (
                <tr
                  className="odd:bg-[#0d343e] even:bg-[#0d3e43]"
                  key={item.employee_id}
                >
                  <td className="text-white">{index + 1}</td>
                  <td className="border-[1px] border-black text-white p-2">
                    {item.employee_code}
                  </td>
                  <td className="border-[1px] border-black text-left text-white p-2">
                    {item.employee_name}
                  </td>
                  <td className="border-[1px] border-black text-left text-white p-2">
                    {item.country_name}
                  </td>
                  <td className="border-[1px] border-black text-white p-2">
                    <div className="flex gap-1 justify-evenly">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="p-1 bg-blue-500 hover:bg-blue-400 text-white rounded-md flex my-auto"
                      >
                        <MdOutlineRemoveRedEye
                          size={20}
                          className="my-auto pr-1"
                        />{" "}
                        View
                      </button>
                      <button
                        onClick={() => {
                          setUpdatePopup(true);
                          setUserToEdit(item);
                          setFormData({
                            employee_name: item.employee_name,
                            country_id: item.country_id,
                          });
                        }}
                        className="p-1 bg-green-500 hover:bg-green-400 text-white rounded-md flex my-auto"
                      >
                        <BsPencilSquare size={20} className="my-auto pr-1" />{" "}
                        Update
                      </button>
                      <button
                        onClick={togglePopup}
                        className="p-1 pr-2 bg-red-500 hover:bg-red-400 text-white rounded-md flex my-auto"
                      >
                        <MdDeleteOutline size={23} className="my-auto" /> Delete
                      </button>
                    </div>

                    {/* view popUp */}

                    {/* Employee Details Modal */}
                    {selectedEmployee && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-[#0F969C] px-5 py-5 rounded-md text-white">
                          <h1 className="text-xl text-center py-5"> View Employee Details</h1>
                          <table className="text-left">
                            <tbody>
                              <tr>
                                <th className="border border-black py-5 px-3">
                                  Profile: 
                                </th>
                                <td className="border border-black py-5 px-3">
                                  <PiUserCircleFill size={25} />
                                </td>  
                              </tr>
                              <tr>
                                <th className="border border-black py-5 px-3">
                                  Employee ID:
                                </th>
                                <td className="border border-black py-5 px-3">
                                  {selectedEmployee.employee_id}
                                </td>
                              </tr>
                              <tr>
                                <th className="border border-black py-5 px-3">
                                  Employee Code:
                                </th>
                                <td className="border border-black py-5 px-3">
                                  {selectedEmployee.employee_code}
                                </td>
                              </tr>
                              <tr>
                                <th className="border border-black py-5 px-3">
                                  Employee Name:
                                </th>
                                <td className="border border-black py-5 px-3">
                                  {" "}
                                  {selectedEmployee.employee_name}
                                </td>
                              </tr>
                              <tr>
                                <th className="border border-black py-5 px-3">
                                  Country Name:{" "}
                                </th>
                                <td className="border border-black py-5 px-3">
                                  {selectedEmployee.country_name}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          {/* Add more details as needed */}
                          <button
                            className=" mt-5 bg-gray-700 hover:bg-gray-500 px-10 py-3 text-white rounded-3xl"
                            onClick={() => setSelectedEmployee(null)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Update Popup */}

                    {updatePopup && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-[#0F969C] px-3 py-3 rounded-md text-black">
                          <form onSubmit={handleUpdateSubmit}>
                            <h1 className="text-white text-xl">
                              Update Employee Information
                            </h1>
                            <div className="grid grid-cols-2 gap-6 mt-5 p-4">
                              <label className="flex flex-col text-left gap-2 text-bold text-white lg:text-lg md:text-md text-sm">
                                Employee Id:
                                <input
                                  type="text"
                                  value={userToEdit.employee_id}
                                  className="border-black border-[2px] bg-gray-300 cursor-not-allowed p-2 rounded-md text-black focus:outline-none focus:ring focus:ring-green-500"
                                  readOnly
                                />
                              </label>
                              <label className="flex flex-col text-left gap-2 text-bold text-white lg:text-lg md:text-md text-sm">
                                Employee Code :
                                <input
                                  type="text"
                                  value={userToEdit.employee_code}
                                  className="border-black border-[2px] bg-gray-300 cursor-not-allowed p-2 rounded-md text-black focus:outline-none focus:ring focus:ring-green-500"
                                  readOnly
                                />
                              </label>
                              <label className="flex flex-col text-left gap-2 text-bold text-white lg:text-lg md:text-md text-sm">
                                Employee Name :
                                <input
                                  type="text"
                                  required
                                  value={formData.employee_name}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      employee_name: e.target.value,
                                    })
                                  }
                                  className="p-2 rounded-md text-black focus:outline-none focus:ring focus:ring-green-500"
                                />
                              </label>
                              <label className="flex flex-col text-left gap-2 text-bold text-white lg:text-lg md:text-md text-sm">
                                Country Name :
                                <select
                                  className="p-2 rounded-md text-black"
                                  name="select"
                                  value={formData.country_id}
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      country_id: e.target.value,
                                    });
                                  }}
                                >
                                  <option
                                    defaultValue={userToEdit.country_id}
                                    className="focus:outline-none focus:ring focus:ring-green-500"
                                  >
                                    {userToEdit.country_name}
                                  </option>
                                  {/* country name and id should be in the name which as created in db column name */}
                                  {countryName.map((country) => (
                                    <option
                                      value={country.country_id}
                                      key={country.country_id}
                                    >
                                      {country.country_name}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            <div className="mt-5 flex justify-center gap-5">
                              <button
                                type="button"
                                onClick={updatePopups}
                                className="bg-gray-700 hover:bg-gray-500 px-10 py-3 text-white rounded-3xl"
                              >
                                Cancle
                              </button>
                              <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-400 px-8 py-3 text-white rounded-3xl flex my-auto"
                              >
                                <BsPencilSquare size={20} className="my-auto pr-1" />
                                Update
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    {/*  Delete Popup */}

                    {showPopup && (
                      <div className="absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-[#FEFEFE] px-3 py-3 rounded-md">
                          <div className="text-right">
                            <button
                              onClick={togglePopup}
                              className="text-gray-700 text-2xl"
                            >
                              <IoMdClose />
                            </button>
                          </div>
                          <div className="flex flex-col gap-5 max-w-[500px] px-10 text-black">
                            <h1 className="text-center text-2xl font-bold">
                              Delete Employee ?
                            </h1>
                            <div className="text-center text-md">
                              <p className="">
                                Are you sure do you want to delete the employee
                                ?
                              </p>
                              <p className="">You can't undo this action.</p>
                            </div>
                            <div className="bg-[#FFCEB1] border-l-[4px] border-red-500 rounded-s-sm p-5">
                              <div className="flex ">
                                <TiWarning className="my-auto text-red-600" />{" "}
                                <h2 className="text-red-800">Warning</h2>
                              </div>
                              <div>
                                If you delete the employee, you may lose of
                                their information.
                              </div>
                            </div>
                            <div className="flex justify-center gap-5 pb-5 ">
                              <button
                                onClick={togglePopup}
                                className="bg-gray-700 hover:bg-gray-500 px-10 py-3 text-white rounded-3xl"
                              >
                                Cancel
                              </button>

                              <button
                                onClick={() => {
                                  deleteUser(item.employee_id);
                                  togglePopup();
                                }}
                                className="bg-red-500 hover:bg-red-400 px-8 py-3  text-white rounded-3xl flex my-auto"
                              >
                                <MdDeleteOutline
                                  size={20}
                                  className="my-auto"
                                />{" "}
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="flex justify-center mt-5 text-white">
            {/* previous button hide and go back from last page  */}
            <div className="flex pr-2">
              {currentPage > 1 && (
                <button onClick={goBack} className="flex my-auto">
                  {" "}
                  <MdOutlineArrowBackIosNew
                    size={15}
                    className=" my-auto"
                  />{" "}
                  Back
                </button>
              )}
            </div>
            {/*  Showing number of pages */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-500"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <div className="flex pl-2">
              {currentPage < totalPages && (
                <button onClick={goNext} className="flex my-auto">
                  {" "}
                  Next{" "}
                  <MdOutlineArrowBackIosNew
                    size={15}
                    className=" rotate-[180deg] my-auto"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;