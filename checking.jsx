import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsArrowUp, BsArrowDown } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import {
  MdDeleteOutline,
  MdOutlineRemoveRedEye,
  MdOutlineArrowBackIosNew,
} from "react-icons/md";

const EmployeeList = () => {
  const [empDetails, setEmpDetails] = useState({
    employeeList: [],
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState({
    column: "",
    order: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const onSort = (key) => {
    let order = "asc";
    if (sortOrder.column === key && sortOrder.order === "asc") {
      order = "desc";
    }
    setSortOrder({ column: key, order });
  };

  const sortedEmployeeList = [...empDetails.employeeList].sort((a, b) => {
    if (sortOrder.order === "asc") {
      return a[sortOrder.column] > b[sortOrder.column] ? -1 : 1;
    } else {
      return a[sortOrder.column] < b[sortOrder.column] ? -1 : 1;
    }
  });

  const filteredEmployeeList = sortedEmployeeList.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredEmployeeList.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredEmployeeList.length / itemsPerPage);

  useEffect(() => {
    const getEmpList = async () => {
      try {
        let response = await fetch(
          "http://localhost:4000/api/get_employee_table_list"
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
    getEmpList();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const goBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageFilter = (selectedRowsPerPage) => {
    setItemsPerPage(selectedRowsPerPage);
    setCurrentPage(1);
  };

  const renderSortIcon = (column) => {
    if (sortOrder.column === column) {
      return sortOrder.order === "asc" ? <BsArrowUp /> : <BsArrowDown />;
    }
    return null;
  };

  return (
    <div className="bg-[#072E33] h-screen overflow-auto">
      <div className="grid max-w-[1280px] mx-auto">
        <div className="my-10">
          <div className="flex justify-between bg-[#0F969C] p-3 my-auto border-black border-[1px]">
            <h1 className="text-2xl font-bold text-white">Employee List</h1>
            <div className="flex my-auto rounded-md">
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
          <table className="w-full">
            <thead className="bg-[#0c7075] text-white ">
              <tr className="text-center">
                <th
                  className="border-[1px] border-black p-2 cursor-pointer"
                  onClick={() => onSort("employee_id")}
                >
                  Employee Id {renderSortIcon("employee_id")}
                </th>
                <th
                  className="border-[1px] border-black p-2 cursor-pointer"
                  onClick={() => onSort("employee_code")}
                >
                  Employee Code {renderSortIcon("employee_code")}
                </th>
                <th
                  className="border-[1px] border-black p-2 cursor-pointer"
                  onClick={() => onSort("employee_name")}
                >
                  Employee Name {renderSortIcon("employee_name")}
                </th>
                <th
                  className="border-[1px] border-black p-2 cursor-pointer"
                  onClick={() => onSort("country_name")}
                >
                  Country Name {renderSortIcon("country_name")}
                </th>
                <th className="border-[1px] border-black p-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {currentItems.map((item) => (
                <tr
                  className="odd:bg-[#0d343e] even:bg-[#0d3e43]"
                  key={item.employee_id}
                >
                  <td className="border-[1px] border-black text-white  p-2">
                    {item.employee_id}
                  </td>
                  <td className="border-[1px] border-black text-white p-2">
                    {item.employee_code}
                  </td>
                  <td className="border-[1px] border-black text-white p-2">
                    {item.employee_name}
                  </td>
                  <td className="border-[1px] border-black text-white p-2">
                    {item.country_name}
                  </td>
                  <td className="border-[1px] border-black text-white p-2">
                    <div className="flex justify-evenly">
                      <button className="p-1 bg-blue-500 hover:bg-blue-400 text-white rounded-md">
                        <MdOutlineRemoveRedEye size={20} />
                      </button>
                      <button className="p-2 bg-green-500 hover:bg-green-400 text-white rounded-md">
                        <BsPencilSquare size={15} />
                      </button>
                      <button className="p-1 bg-red-500 hover:bg-red-400 text-white rounded-md">
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-5 text-white">
            <div className="flex p-1">
              {currentPage > 1 && (
                <button onClick={goBack} className="flex my-auto p-1">
                  <MdOutlineArrowBackIosNew size={15} className=" my-auto" /> Back
                </button>
              )}
            </div>
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
            <div className="flex p-1">
              {currentPage < totalPages && (
                <button onClick={goNext} className="flex my-auto p-1">
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














// node Js




// Old method code

// app.delete("/api/detele_employee_table_list/:employee_id", async (req, res) => {
//   try {
//     const { employee_id } = req.params;

//     const result = await client.query({
//       text: "select * from delete_employee_info($1)",
//       values: [employee_id],
//     });
//     // After delete data send a success response to frontend
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({success:false , message: "Deleting Server Error!" });
//   }
// });


// commonly use way of code.

app.delete("/api/detele_employee_table_list/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;

    const result = await client.query({
      text: "select * from delete_employee_info($1)",
      values: [employee_id],
    });

    // After delete data send a success response to frontend
    if(result?.rows[0]?.delete_employee_info === true) {

      res.json({ success: true , message : "Deleted  Successfully!" , data : result.rows[0]}) ;
    }
    else{
      console.log(result);
      res.status(404).json({success : false ,message :result?.rows[1]?.delete_employee_info });
      console.log("issue on delete employee id");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({success:false , message: "Deleting Server Error!" });
  }
});
