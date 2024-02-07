  // input field text editing disable
  const [isDisabled] = useState(true);


  // get the data value from database and list out all the datas
  const [countryName, setCountryName] = useState([{ id: "", name: "" }]);

  // Country name show on drop down names
  const [selectedCountry, setSelectedCountry] = useState();

  // post the id value after click the submit
  const [country_id, setCountryId] = useState();

  // Select country required

  const [showCountryWarning, setShowCountryWarning] = useState(false);

  // this will update the id value to database to employee_details table.
  const handleChange = (e) => {
    setSelectedCountry(e.target.value);
    setCountryId(e.target.value);
    setShowCountryWarning(false); // initial it is false like as 0
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

  // update name and country 

  const [employee_name , setEmployeeName] = useState();

  const handleUpdateSubmit = async (e , employee_id) => {
    e.preventDefault();
    try{
      const result = await axios.put(`http://localhost:4000/api/update_employee_table_list/${employee_id}` , {
         employee_name ,
         country_id
      });
      console.log(result);
    } catch (error) {
      console.log(error , "Error");
    }
  }





{updatePopup && (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="bg-[#FEFEFE] px-3 py-3 rounded-md text-black">
        <h1 className="text-center font-bold pb-5">
          Employee Update
        </h1>
        <form onSubmit={handleUpdateSubmit} className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={item.employee_id}
            name="empId"
            disabled={isDisabled}
            className="border-2 border-black p-2 rounded-md"
          />
          <input
            type="text"
            value={item.employee_code}
            name="empCode"
            disabled={isDisabled}
            className="border-2 border-black p-2 rounded-md"
          />
          <input
            type="text"
            value={item.employee_name}
            name="empName"
            onChange={(e) => setEmployeeName(e.target.value)}
            className="border-2 border-black p-2 rounded-md"
          />
          <select
            className="p-2 rounded-md text-black"
            name="select"
            value={selectedCountry}
            onChange={(handleChange)}
          >
            <option
              value=""
              className="focus:outline-none focus:ring focus:ring-green-500"
            >
              Select Country
            </option>
            {/* country name and id should be in the name which as created in db column name */}

            {countryName.map((country, country_id) => (
              <option
              // onChange={(e) => setCountryId(e)}
                value={country.country_id}
                key={country_id}
              >
                {" "}
                {country.country_name}{" "}
              </option>
            ))}
          </select>
          {showCountryWarning && (
            <p
              style={{
                color: "yellow",
                userSelect: "none",
              }}
            >
              {" "}
              Please Select Country !{" "}
            </p>
          )}
          <input type="submit" />
        </form>
      </div>
    </div>
  )
}