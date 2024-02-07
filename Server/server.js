const express = require("express"); //Middelware
const cors = require("cors"); // Browser HTTP header based and allow to communicate to api other domain
const client = require("./employeedb"); // connect the database table to node

const app = express();

app.use(express.json());
app.use(cors());

// connection error or successfull message.
client.connect((error) => {
  if (error) {
    console.log("Error connecting to Postgresql in database: ", error);
    return;
  }
  console.log("Connected to Postgresql database");
});

// insert the detail from user
app.post("/api/employee_details", async (req, res) => {
  try {
    const { employee_code, employee_name, country_id } = req.body;

    // Call the PostgreSQL function insert_employee_details
    const result = await client.query({
      text: "SELECT * FROM insert_employee_details($1, $2, $3)",
      values: [employee_code, employee_name, country_id],
    });

    // data save it response and show in json format and check emp code and update
    if (result?.rows[0]?.insert_employee_details === "success") {
      console.log("Data Saved");
      // console.log('Employee Details Added Successfully'); or
      console.log(result);
      res.json({
        success: true,
        message: "Employee Details Added Successfully",
      });
    } 
    // Check if the comployee code if already exists
    else {
      console.log(result);
      res
        .status(400)
        .json({
          success: false,
          message: result?.rows[0]?.insert_employee_details,
        });
      console.log("Employee code already exists!");
    }

    // any issuse in inserting the db catch error and show.
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// To get the country code and country name from database
app.get("/api/country_list", async (req, res) => {
  try {
    const { country_id, country_name } = req.query;

    const result = await client.query({
      text: "SELECT * FROM country_list($1 , $2)",
      values: [country_id, country_name],
    });
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Get employee code to check the already exists .
// This api for employee List
app.get("/api/get_employee_table_list", async (req, res) => {
  try {
    const { employee_id, employee_code, employee_name, country_name } =
      req.body;
    const result = await client.query({
      text: "select * from employee_table_list($1 , $2 , $3 ,$4)",
      values: [employee_id, employee_code, employee_name, country_name],
    });
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query in employee_table_list:", error);
    res.status(501).json({ success: false, message: "Internal Server Error" });
  }
});

// get for update details from employee details
app.get("/api/get_employee_details" , async (req , res) => {
  try {
    const { employee_id } = req.params;
    const result = await client.query({
      text: 'SELECT * FROM get_employee_details_view($1)',
      values: [employee_id],
    });
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing get employee details:', error);
    throw error;
  }
});

//  Delete user based on thier ID

app.delete("/api/detele_employee_table_list/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;

    const result = await client.query({
      text: "select * from delete_employee_info($1)",
      values: [employee_id],
    });

    // After delete data send a success response to frontend
    if(result?.rows[0]?.delete_employee_info === true) {

      res.json({ success: true , message :"Delete Successfully"});
    }
    else{
      console.log(result);
      res.status(404).json({success : false ,message :result?.rows[0]?.delete_employee_info });
      console.log("issue on delete employee id");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({success:false , message: "Deleting Server Error!" });
  }
});



// Update the employee details based on their employee Id

app.put("/api/update_employee_table_list/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params; // Extract employee_id from params
    const { employee_name, country_id } = req.body;

    const result = await client.query({
      text: "SELECT * FROM update_employee_info($1, $2, $3)",
      values: [employee_id, employee_name, country_id],
    });
    // if(result?.rows[0]?.update_employee_info === 'success') {
    //   res.json({
    //     success : true ,
    //     message : "Employee Information Updated Succesfully!"
    //   });
    // }
    // else {
    //   res.status(400).json({
    //     success : false ,
    //     message : result?.rows[0]?.update_employee_info
    //   });
    //   console.log("Employee details update issue");
    // }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Updating Server Error!" });
  }
});



//  App port in running 4000  or you can change it as per your requirement.
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));































































// -----------------------------------------------------------------------------------------------------------------------------------------

// app.post("/api/employee_details", async (req, res) => {
//     try {
//         const { employee_code, employee_name, country_id } = req.body;

//         // Call the PostgreSQL function insert_employee_details
//         const result = await client.query({
//             text: 'SELECT * FROM insert_employee_details($1, $2, $3)',
//             values: [employee_code, employee_name, country_id],
//         });

//         const { result_code , result_message } = result.rows[0];

//         if(result_code === 0){
//           console.log("Data Saved");
//           console.log(result_message);  // Assuming your function returns a result
//           res.send("Response Received: " + JSON.stringify(req.body));
//         }
//         else {
//           console.log(result_message)
//           res.status(400).send(result_message);
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }
// });

// -------------------------------------------------------------------------------------------------------------------------------------------

// get the details from user to store the database
// app.post("/api/employee_details", (req,res) => {

//   // Calling the column name from employee_details table.
//     const employee_code = req.body["employee_code"]
//     const employee_name = req.body["employee_name"]
//     const country_id = req.body["country_id"]

//     // post the data from user to database
//     const insertValue = `Insert into employee_details ( employee_code , employee_name , country_id)
//                          values ('${employee_code}' , '${employee_name}' , '${country_id}')`

//     client
//      .query(insertValue)
//      .then((response) => {
//         console.log("Data Saved");
//         console.log(response);
//      })
//      .catch((err) => {
//         console.log(err);
//      });

//     console.log(req.body);
//     res.send("Response Received: " + req.body);
// });
