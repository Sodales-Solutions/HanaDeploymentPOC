/******************************************Project-WOODBRIDGE***********************************************************/
/* Developer Name 				:  	 Raj Powar																		           */
/* Date      					:    28-03-2023																			           */
/* Application Name				: 	 Corrective Action Dashboard							    				                                   */
/* Functionality 				:  	 Service to update CA Status		    	    								                               */
/* Service Name 				: 	 INC_CAStatusUpdate.xsjs														                           */
/***********************************************************************************************************************/
 
var conn, query, cstmt; // variables for database connection and query statement
// Function To get The Records from Fields Management Information.
function UpdateCAStatus() {
       conn = $.db.getConnection(); // Open Database Connection.
       var pstmt,rs,query,queqwewqeweqwery1,pstmt1,rs1,rs2,pstmt2,query3,CurrentDate,DueDate,StatusUpdate;
       
    //   conn.commit();qweqweweqweqweqwewewe
var teststring = 'test DB deployment through Git Hub for test Library Services'; 

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
