$('#ca-container').contentcarousel();
					
$('a.tag').live('click', function(e){
    
    // add selected class
    $(this).toggleClass('selected');
    
    // make a collection of tags
    var newTag = [];
    $('a.tag.selected').each(function(){
                
        // add value;
        newTag.push($(this).text());
    });
    $('#q1').val(newTag.join(', '));
    
    return false;  
});

 