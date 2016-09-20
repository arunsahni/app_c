var collabmedia = angular.module('collabmedia');


/*
	Define all apis : Module Wise
*/
collabmedia.constant('frontApiBundle', [function () {
	/*Common Management :
		
	*/
	var apiObj = {};
	
	apiObj.COMMON = {};
		
	apiObj.COMMON = {
				fsg_view : "/fsg/view",
				domains_view : "/domains/view",
				collections_view : "/collections/view",
				groupTags_without_descriptors : "/groupTags/without_descriptors",
				metaMetaTags_view : "/metaMetaTags/view",
				proxy_get_oembed : "/proxy/get_oembed",
				tags_view : "/tags/view"
		};
	apiObj.COMMON.category = "GL";
	
	/*User Management :
		1) Add User - create
		2) View User - read
		3) Edit User - update
		4) Delete User - delete
	*/
	apiObj.USER = {};
		
	apiObj.USER = {
				login : "/user/login",
				chklogin : "/user/chklogin",
				register : "/user/register",
				addFsg : "/user/addFsg",
				fileUpload : "/user/fileUpload",
				saveFile : "/user/saveFile",
				upload_dp : "/users/upload_dp", //probably not in use
				logout : "/user/logout",
				new_password : "/user/new_password",
				reset_password : "/user/reset_password",
				fsgArrUpdate : "/user/fsgArrUpdate",
				saveSettings : "/user/saveSettings"
		};
	apiObj.USER.category = "UR";
	
	/*Member Management :
		1) Add Member - create
		2) List Member - read
		3) Edit Member - update
		4) Delete Member - delete
	*/
	apiObj.MEMBER = {};

	apiObj.MEMBER = {
				add : "",
				list : "",
				view : "",
				update : "",
				del : ""
		};
	apiObj.MEMBER.category = "UR";

	/*
	Group Management :
		1) Add Group - create
		2) List/view Group(s) - read
		3) update Group - update
		4) Delete Group - delete
		5) Add Member in Group - update
	*/
	apiObj.GROUP = {};

	apiObj.GROUP = {
				add : "",
				list : "",
				view : "",
				update : "",
				del : ""
		};
	

	/*	
	Project Management :
		1) Add Project - create
		2) List/view project(s) - read
		3) Update Project - update
		4) Delete Project - delete
	*/
	apiObj.PROJECT = {};

	apiObj.PROJECT = {
				add : "/projects/add",
				list : "/projects",
				view : "",
				update : "/projects/edit",
				del : "/projects/delete"
		};
	apiObj.PROJECT.category = "UL";


	/*	
	Board Management :
		1) Add Board - create
		2) List Boards - read
		3) view Board - read
		4) Rename Board - update
		5) Delete Board - delete
	*/
	apiObj.BOARD = {};

	apiObj.BOARD = {
				add : "/boards/add",
				list : "/boards",	//optimize this api : only required fields should  return from api.
				update : "/boards/edit",
				del : "/boards/delete",
				uploadHeader : "/boards/uploadHeader",
				userBoards : "/boards/userBoards",
				renameTheme : "/boards/renameTheme",
				createGroupTag : "/boards/createGroupTag",
				addExistingGroupTag : "/boards/addGroupTag",
				deleteGroupTag : "/boards/deleteGroupTag",
				rename : "/boards/rename",
				move : "/boards/move",
				duplicate : "/boards/duplicate"
		};
	apiObj.BOARD.category = "PE";
	
		
	/*	
	Board Sub-Modules :
	*/

	/*
	Media Management:
		1) Post media - create
		2) Media list/Search - read
		3) delete Media - delete - Owner, Co-Owner 
		
		4) Add Stamp - update
		5) Add Mark - update
		6) Add Vote - update
		6) Repost - update
	*/
	apiObj.MEDIA = {};

	apiObj.MEDIA = {
				searchEngine : "/media/searchEngine",
				addViews : "/media/addViews",
				viewMedia : "/media/viewMedia",
				actions : "/media/actions"
		};
	apiObj.MEDIA.category = "PE";
	
	/*
	Board Media Management:
		1) post media - create
		2) Discuss Media list - read
		3) delete Media - delete - Owner, Co-Owner 
		
		4) Add Stamp - update
		5) Add Mark - update
		6) Add Vote - update
	*/
	apiObj.BOARD_MEDIA = {};

	apiObj.BOARD_MEDIA = {
				uploadMedia : "/boards/uploadMedia",
				uploadLink : "/media/uploadLink",
				videoUpload : "/media/videoUpload",
				audioUpload : "/media/audioUpload",
				uploadRecordedVideo : "/recorder/uploadRecordedVideo",
				updateMontage : "/media/updateMontage",
				addBoardMediaToBoard : "/addBoardMediaToBoard",
				getBoardMedia : "/media/getBoardMedia",
				myBoardsMedia : "/myBoards", //optimize this api : only required fields should return from api. 
				media_descriptor : "/media/descriptor",
				addTagsToUploadedMedia : "/media/addTagsToUploadedMedia",
				makePublic : "/media/makePublic",
				note_screenshot : "/media/note_screenshot",
				getMediaDetail : "/media/getMediaDetail",
				deleteMedia : "/boards/deleteMedia",
				froala_file : "media/froala_file"
				
		};

	apiObj.BOARD_MEDIA.category = "PE";
	
	/*	
	Board Member/Invitees Management :
		1) Add/Invite Board Member - create
		2) List Board Member - read
		3) Edit Board Member - update
		4) Delete Board Member - delete
		5) Change Role - update
	*/
	apiObj.BOARD_INVITEES = {};

	apiObj.BOARD_INVITEES = {
				myInvitees : "/myInvitees",
				myInvitees_board : "/myInvitees/board",
				addMembers : "/boards/addMembers",
				deleteInvitee : "/boards/deleteInvitee",
		};
	apiObj.BOARD_INVITEES.category = "PE";	


	/*	
	Board "Page Theme/GT/Descriptor/Keyword" Management :
		1) Add Keyword/GT/Page Theme - create
		2) List Keyword/GT/Page Theme - read
		3) Rename Keyword/GT/Page Theme - update
		4) Delete Keyword/GT/Page Theme - delete
	*/
	apiObj.BOARD_KEYWORD = {};

	apiObj.BOARD_KEYWORD = {
				add : "",
				list : "",
				view : "",
				update : "",
				del : ""
		};
	
	apiObj.BOARD_KEYWORD.category = "PE";

	/*	
	Board Header Management :
		1) Add Header Image - create
		2) View Header Image - read
		3) Update Header Image - update
		4) Delete Header Image - delete - Not Implemented/Required yet.
	*/
	apiObj.BOARD_HEADER = {};

	apiObj.BOARD_HEADER = {
				add : "",
				list : "",
				view : "",
				update : "",
				del : "",
				uploadHeader : "/boards/uploadHeader",
		};
		
	apiObj.BOARD_HEADER.category = "PE";
	


	/*	
	Board Background Music Management :
		1) Add Background Music - create
		2) View Background Music - read
		3) Update Background Music - update
		4) Delete Background Music - delete - Not Implemented/Required yet.	
	*/
	apiObj.BOARD_BGMUSIC = {};

	apiObj.BOARD_BGMUSIC = {
				add : "",
				list : "",
				view : "",
				update : "",
				del : "",
				uploadHeader : "/boards/uploadHeader"
		};
	apiObj.BOARD_BGMUSIC.category = "PE";

	/*	
	Board Comment Management :
		1) Add Comment - create
		2) List Comments - read
		3) Update Comment - Not Implemented/Required Yet!
		4) Delete Comment - delete
	*/
	apiObj.BOARD_COMMENT = {};

	apiObj.BOARD_COMMENT = {
				add : "",
				list : "",
				view : "",
				update : "",
				del : "",
				addComment : "/boards/addComment",
				cmntVote : "/boards/cmntVote",
				cmntDelete : "/boards/cmntDelete",
				
		};
		
	apiObj.BOARD_COMMENT.category = "PE";

	/*	
	Board Setting Management :
		1)  
	*/

	return apiObj;
  
}]);