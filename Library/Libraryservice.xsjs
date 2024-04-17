
var conn, query, cstmt;sfsdgdfgfd // variables for database connection and query statement
// Function To get The Records from Fields Management Information.
function UpdateCAStatus() {
       conn = $.db.getConnection(); // Open Database Connection.
       var pstmt,rs,query,query1,pstmt1,rs1,rs2,pstmt2,query3,CurrentDate,DueDate,StatusUpdate;
       RSDGDSGDFGDFGD
       123456
       etertr
       11111111
    //   conn.commit();
var teststring = 'test DB deployment through Git Hub'; 
fdssrfrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
tttttttttttttttt
dfghjkl
 
 
 fcvgbhnjmk,
       conn.close();	// close connection
      var body = JSON.stringify("success");
      $.response.contentType = 'application/json';
      $.response.setBody(body);
      $.response.status = $.net.http.OK;
 
}
 
// Function for validation of input. Returns true/false for valid/invalid inputs
function validateInput() {
      return true;
}
function processRequest() {
      if (validateInput()) {
              try {
                     switch ($.request.method) {
                     case $.net.http.GET:
                          UpdateCAStatus(); 
                          break;
                     default:
                          $.response.status = $.net.http.METHOD_NOT_ALLOWED;
                          $.response.setBody("Wrong request method");
                          break;
                     }
                     $.response.contentType = "application/json";
              } catch (e) {
                     $.response.setBody("Failed to execute action: " + e.toString());
              }
      }
}
processRequest();