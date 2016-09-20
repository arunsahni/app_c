var mongoose = require('mongoose');
var votesSchema = new mongoose.Schema({	
	VotedBy:{type:mongoose.Schema.Types.ObjectId, ref: 'user'}, 
	VotedOn:{type:Date,default:Date.now()}
});

var marksSchema = new mongoose.Schema({	
	MarkedBy:{type:mongoose.Schema.Types.ObjectId, ref: 'user'}, 
	MarkedOn:{type:Date}
});

var mediaSchema = new mongoose.Schema({	
	MediaID:{type:mongoose.Schema.Types.ObjectId, ref: 'media'}, 
	MediaURL:{type:String},
	MediaTitle:{type:String},
	Title:{type:String},
	Prompt:{type:String},
	Locator:{type:String},
	MediaType:{type:String},
	ContentType:{type:String},
	PostedBy:{type:mongoose.Schema.Types.ObjectId, ref: 'user'},
	PostedByNickName:{type:String},	
	PostedOn:{type:Date},
	ThemeID:{type:mongoose.Schema.Types.ObjectId, ref: 'groupTags'},
	ThemeTitle:{type:String},
	Votes:[votesSchema],
	Marks:[marksSchema],
	OwnerId:{type:String},
	VoteCount:{type:Number},
	Content:{type:String},
	thumbnail:{type:String}, //added by manishp on 23122014 - Montage case
	PostStatement:{type:String}	//added by manishp on 23042015
});

//Start content page sub-schema

var backgroundSchema = new mongoose.Schema({	
    Type : {type : String , enum : ["color","image","video"] , default : "color"},
    Data : {type : String},		// will contain color, image url or video embed
    LqData : {type : String},	//will contain color, image url or video embed - will be used in case of image and video
    Thumbnail : {type : String},
    BgOpacity : {type : String , default : "1"}
},{_id : false});

var commonParamsSchema = new mongoose.Schema({	
	IsGrid : {type : Boolean , default : false},
        IsSnap : {type : Boolean , default : false},
        ViewportDesktop : {type : Boolean , default : true},
        ViewportTablet : {type : Boolean , default : false},
        ViewportMobile : {type : Boolean , default : false},
	Background : backgroundSchema
},{_id : false});

var widgetsSchema = new mongoose.Schema({
	SrNo : {type : Number , default : 0},
	Animation : {type : String , enum : ["blind","bounce","clip","drop","explode","fade","fold","scale","highlight","transfer","puff","slide","shake","fadeIn","fadeOut"] , default : "drop"},
	BgMusic : {type : String},		
	Type : {type : String , enum : ["text","image","audio","video","questAnswer"] , default : "text"},
	Data : {type : String},			//image - path , audio/video - path / embed code
        LqData : {type : String},               //Low Quality Data
        Thumbnail: {type : String},             //for video, audio case. - workshop widget case
	W : {type : Number , default : 0},
	H : {type : Number , default : 0},
	X : {type : Number , default : 0},
	Y : {type : Number , default : 0},
	Z : {type : Number , default : 0}
});


var viewportDesktopSectionsSchema = new mongoose.Schema({	
	SrNo : {type : Number , default : 0},
	Animation : {type : String},
	Height : {type : Number , default : 640},
        Background : backgroundSchema,
	Widgets : [widgetsSchema]
},{_id : false});

var viewportTabletSectionsSchema = new mongoose.Schema({	
	SrNo : {type : Number , default : 0},
	Animation : {type : String},
	Height : {type : Number , default : 640},
        Background : backgroundSchema,
	Widgets : [widgetsSchema]
},{_id : false});

var viewportMobileSectionsSchema = new mongoose.Schema({	
	SrNo : {type : Number , default : 0},
	Animation : {type : String},
	Height : {type : Number , default : 640},
        Background : backgroundSchema,
	Widgets : [widgetsSchema]
},{_id : false});
//End content page sub-schema

var pageSchema = new mongoose.Schema(
    {	
        Origin:{
            type : String,
            enum : ["created","shared","byTheHouse","duplicated","addedFromLibrary","createdForMe","published","publishNewChanges","purchased","gifted"],
            default : "created"
        },
        OriginatedFrom:{			//keep the id from which the instance is created, useful for other than Origin = created case.
            type : mongoose.Schema.Types.ObjectId
        },
        Title:{
            type : String,
            default : "Untitled Page"
        },
        CreaterId : {
            type: String, 
            ref: 'user',
            required : true
        },
        OwnerId : {									//- OwnerID	before
            type: String, 
            ref: 'user',
            required : true
        },
        OwnerEmail : {									//- To Manage ShareWith Case: Non-Registered user
                type: String 
        },
        ChapterId : { 								//- ProjectId before
                type: String, 
                ref: 'Chapters' 
        },
        ChapterTitle : { 
                type: String 
        },
        PageType : {
            type : String,
            enum : ["gallery","content"],
            required : true
        },
        Order : { 
            type: Number,
            default : 0
        },
        Status : { 
            type: Boolean,
            default : 0
        }, 
        IsDeleted : {
            type : Boolean,
            default : 0
        },
        CreatedOn : { 
            type : Date,
            default : Date.now() 
        },
        UpdatedOn : { 
            type : Date, 
            default : Date.now() 
        },
        TotalVoteCount :{
            type : Number
        },
        HeaderImage : {
            type : String
        },
        BackgroundMusic : {
            type : String
        },
        Medias : [mediaSchema], 
        IsLaunched : {
            type : Boolean,
            default : 0
        },
		QuestionTip : {
            type : String
        },
		uploadedVideo : {
            type : String
        },
        SelectionCriteria : {	//this is to define the prefered media of the board - search gallery , which will always comes first.
            type : String,
            enum : ["media","keyword","all-media","hand-picked","theme","descriptor","filter","upload"],	//keyword will be replaced by themes & descriptors
            default : "media"
        },
        SelectedMedia : { 
            type : Array 
        },
        SelectedKeywords : { 
            type : Array 
        },
	SelectedFilters : { 	//this is used for filter selectionCriteria - to save default filters.
            type : Object
        },
	SelectedGts:{
	    type: Array	
	},
	AddAnotherGts:{
	    type: Array	
	},
	ExcludedGts:{
	    type: Array	
	},
	UploadedMedia : { 
	    type : Array 
        },
	mediaTypes : {
	     type : Array	
	},
	PageFilters : {
	    type:Object
	},
	mediaRange : {
	    type : Number,
	    default : 100
	},
	IsDasheditpage : {	
            type : Boolean,
            default : 0			//0 for the normal page and 1 for the edit copy at the dashboard 
        },
        CommonParams : commonParamsSchema,
        ViewportDesktopSections : viewportDesktopSectionsSchema,
        ViewportTabletSections : viewportTabletSectionsSchema,
        ViewportMobileSections : viewportMobileSectionsSchema
    }, 
    { 
        collection: 'Pages' 
    }
);

var page = mongoose.model('Pages', pageSchema);

module.exports = page;