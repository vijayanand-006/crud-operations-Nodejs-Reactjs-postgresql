import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

const EmployeeForm = () => {
  // set the input field to get the user data
  const [employee_code, setEmployeeCode] = useState();
  const [employee_name, setEmployeeName] = useState();

  // get the data value from database and list out all the datas
  const [countryName, setCountryName] = useState([{ id: "", name: "" }]);

  // post the id value after click the submit
  const [country_id, setCountryId] = useState();

  // Country name show on drop down names
  const [selectedCountry, setSelectedCountry] = useState();

  // Show already exists message in form
  const [EmpCodeExists, setEmpCodeExists] = useState(false);

  // Special character controller for employee Name
  const handleInputChange = (e) => {
    const value = e.target.value;

    // Regular expression to allow only one special character
    const specialCharRegex = /^[a-zA-Z ]*'?[a-zA-Z ]*$/;

    if (specialCharRegex.test(value)) {
      setEmployeeName(value);
    }
  };

  // Special character controller for employee code.
  const handleInputChanges = (e) => {
    const value = e.target.value;

    // Regular expression to allow only one special character
    const specialCharRegex = /^[a-zA-Z0-9]*$/;

    if (specialCharRegex.test(value)) {
      setEmployeeCode(value);
    }
  };

  // Select country required
  const [showCountryWarning, setShowCountryWarning] = useState(false);

  // this will update the id value to database to employee_details table.
  const handleChange = (e) => {
    setSelectedCountry(e.target.value);
    setCountryId(e.target.value);
    setShowCountryWarning(false); // initial it is false like as 0
  };

  // After submitting the form the save btn will disable
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  // disable the button will be false.  
  const disableButton = () => {
    setButtonDisabled(false);
  };

  // reset the input field
  const handleFormReset = () => {
    setEmployeeCode("");
    setEmployeeName("");
    setEmpCodeExists("");
    setShowCountryWarning("");
    setButtonDisabled(false); // Re-enable the button when the form is reset
  };

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

  // Submit all data to the database
  const handleSumbit = async (e) => {
    e.preventDefault();


    // After submit the successfully the employee_name and employee_code will clear
    setEmployeeCode("");
    setEmployeeName("");

    // the country not select it will warning message to the user || Functionality of Alert
    if (!selectedCountry) {
      setShowCountryWarning(true);
      return;
    }

    // if the user will submit the form the button will disable
    setButtonDisabled(true);

    // Post the user information to the database
    try {
      const result = await axios.post(
        "http://localhost:4000/api/employee_details",
        {
          employee_code,
          employee_name,
          country_id,
        }
      );
        // check the server and send the message to form submitted. 
      if (result.data.success) {
        setButtonDisabled(false);
        console.log("Employee Details Added Successfully");
        alert("Employee Details Added Successfully");
      }
      // error handling while facing some inserting issue
    } catch (error) {
      if (error?.response?.status === 400) {
        console.log(error?.response?.data?.message);
        setEmpCodeExists("Employee Code already Exists");
        setButtonDisabled(false);
      } else {
        console.error("Error:", error);
        console.log(
          "An error occurred while submitting the form. Please try again."
        );
      }
    }
  };

  return (
    <div className="bg-[#072E33]">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex mx-auto absolute top-6 left-6 text-white">
          <IoMdArrowRoundBack size={15} className="my-auto" />
          <a
            href="/"
            className="text-white cursor-pointer"
          >
            Back to Table
          </a>
        </div>
        <div className="grid place-items-center h-screen">
          <form
            onSubmit={handleSumbit}
            className="flex flex-col xl:px-14 xl:py-16 lg:px-12 lg:py-14 px-8 py-10 gap-4 bg-[#0F969C] rounded-md "
          >
            <h1 className="lg:text-3xl md:text-2xl text-xl mx-auto font-bold text-white pb-5">
              Add Employee Details
            </h1>

            {/* Input Field to get employee code */}
            <label className="flex flex-col gap-2 text-bold text-white lg:text-lg md:text-md text-sm">
              Employee Code :
              <input
                type="text"
                value={employee_code}
                minLength={1}
                maxLength={10}
                className="p-2 rounded-md text-black focus:outline-none focus:ring focus:ring-green-500 lowercase"
                placeholder="Employee Code"
                onChange={handleInputChanges}
                required
              />
              {EmpCodeExists && (
                <p style={{ color: "yellow", userSelect: "none" }}>
                  {" "}
                  Employee Code Already Exists!{" "}
                </p>
              )}
            </label>

            {/* Input Field to get employee name */}
            <label className="flex flex-col gap-2 text-bold text-white lg:text-lg md:text-md text-sm">
              Employee Name :
              <input
                type="text"
                value={employee_name}
                minLength={1}
                maxLength={100}
                className="p-2 rounded-md text-black focus:outline-none focus:ring focus:ring-green-500"
                placeholder="Employee Name"
                onChange={handleInputChange}
                required
              />
            </label>

            {/* Country name call from databse and using drop down list  */}
            <label className="flex flex-col gap-2 text-bold text-white lg:text-lg md:text-md text-sm">
              Select Country :
              <select
                className="p-2 rounded-md text-black"
                name="select"
                value={selectedCountry}
                onChange={handleChange}
              >
                <option
                  value=""
                  className="focus:outline-none focus:ring focus:ring-green-500"
                >
                  Select Country
                </option>
                {/* country name and id should be in the name which as created in db column name */}

                {countryName.map((country, country_id) => (
                  <option value={country.country_id} key={country_id}>
                    {" "}
                    {country.country_name}{" "}
                  </option>
                ))}
              </select>
              {showCountryWarning && (
                <p style={{ color: "yellow", userSelect: "none" }}>
                  {" "}
                  Please Select Country !{" "}
                </p>
              )}
            </label>

            {/* Submit and Reset button */}
            <div className="grid grid-cols-2">
              <input
                type="submit"
                value="Save"
                onClick={disableButton}
                className={
                  isButtonDisabled
                    ? "bg-gray-500 text-white cursor-not-allowed m-4 p-2 rounded-md border-none shadow-md"
                    : "bg-black text-white cursor-pointer p-2 m-4 rounded-md text-bold transition ease-in-out delay-150 bg-black hover:-translate-y-1 hover:scale-110 hover:bg-green-600 duration-300"
                }
                disabled={isButtonDisabled}
              />
              <input
                type="reset"
                value="Clear"
                onClick={handleFormReset}
                className="bg-black text-white cursor-pointer p-2 m-4 rounded-md transition ease-in-out delay-150 bg-black hover:-translate-y-1 hover:scale-110 hover:bg-red-600 duration-300"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
