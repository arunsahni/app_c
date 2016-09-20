var ContentPage = require('./../models/contentPageModel.js');

/*________________________________________________________________________
   * @Date:      		10 Dec 2015
   * @Method :   		create						//testing purpose
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	
   * @Access Category:	
_________________________________________________________________________
*/

var create = function ( req , res ){
	//testing purpose
	var data = req.body.data ? req.body.data : {}; 
	//data['Medias'] = "";
	//data['Medias'].push({});
	console.log("data = ",data);
	ContentPage(data).save(function(err , result){
		if( !err ){
			var response = {
				"Status" : "success",
				"Message" : "Page created successfully"
			}
			res.json(response);
		}
		else{
			var response = {
				"Status" : "failure",
				"Message" : "Error - "+err
			}
			res.json(response);
		}	
	});
}

//Page library Apis - common
exports.create = create;