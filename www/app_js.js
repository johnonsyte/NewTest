var formvote_user=(window.localStorage.getItem('formvote_user'))?JSON.parse(window.localStorage.getItem('formvote_user')):false;
var public=(formvote_user.public)?formvote_user.public:false;
var phone=(formvote_user.phone)?formvote_user.phone:false;
var formvote_post=false;
var profile_id;
var formvote_data=new Object();
var default_transition={transition:'none',reverse:false,changeHash:true};
var image_resolution=function(){
	var object=null;
	var highest={quality:'highest',icon_1:'icon_1',icon_2:'icon_2',icon_3:'icon_3',icon_4:'icon_4',back_icon:'small_icon_back',post_icon:'post_open_btn',home_logo:'home_logo',home_reload:'home_reload'};
	var high={quality:'high',icon_1:'icon_1_h',icon_2:'icon_2_h',icon_3:'icon_3_h',icon_4:'icon_4_h',back_icon:'small_icon_back_h',post_icon:'post_open_btn_h',home_logo:'home_logo_h',home_reload:'home_reload_h'};
	var med={quality:'med',icon_1:'icon_1m',icon_2:'icon_2m',icon_3:'icon_3m',icon_4:'icon_4m',back_icon:'small_icon_back_m',post_icon:'post_open_btn_m',home_logo:'home_logo_m',home_reload:'home_reload_m'};
	if(window.devicePixelRatio)
	{
		if(window.devicePixelRatio==2){object=highest;}
		else if(window.devicePixelRatio>=1.5&&window.devicePixelRatio<2){object=highest;}
		else if(window.devicePixelRatio>=1.3&&window.devicePixelRatio<1.5){object=high;}
		else{object=med;}
	}
	else
	{
		object=med;
	}
	return object;
};
var formvote_images=image_resolution();
function process_image(type,w,h,options_object)
{
	var mobile_width=$(window).width();
	var question_width=mobile_width-12;
	var option_width=Math.round((mobile_width-22)*0.48);
	var ratio=Math.round((w/h)*1000)/1000;
	var object=new Object();
	if(type=='question')
	{
		
		object.height=Math.round(question_width/ratio);
	}
	else if(type=='option')
	{
		object.height=Math.round(option_width/ratio);
	}
	else if(type=='options_height')
	{
		var total_images=options_object.length;
		var all_heights=0;
		for(var i=0;i<total_images;i++)
		{
			if(options_object[i].a_img_dimensions)
			{
				var w=options_object[i].a_img_dimensions.w;
				var h=options_object[i].a_img_dimensions.h;
				var ratio=Math.round((w/h)*1000)/1000;
				all_heights+=Math.round(option_width/ratio);
			}
		}
		object.height=Math.round(all_heights/total_images);
	}
	if(h>w)
	{
		var negative_top=Math.round(w/h*100);
		negative_top=100-negative_top;
		negative_top=Math.round(negative_top/2);
		negative_top=negative_top+14;
		object.negative_top=negative_top;
	}
	return object;
}
$.ajaxSetup({cache:false});
$.fn.formvote_buttons=function()
{
	$(this).bind('vmousedown',function(){$(this).addClass('hover');}).bind('vmouseup',function(){$(this).removeClass('hover');});
	return $(this);
}
//

$(document).ready(function(){
	document.addEventListener('deviceready', onDeviceReady, false);
	var press_event='click';
	$('.nav_button_1').bind(press_event,function(){load_home_feed();}).html('<img src="images/'+formvote_images.icon_1+'.png"/>').formvote_buttons();
	$('.nav_button_2').bind(press_event,function(){load_search_page();}).html('<img src="images/'+formvote_images.icon_2+'.png"/>').formvote_buttons();
	$('.nav_button_3').bind(press_event,function(){load_messages_page();}).html('<div class="nav_button_alert"></div><img src="images/'+formvote_images.icon_3+'.png"/>').formvote_buttons();
	$('.nav_button_4').bind(press_event,function(){load_notifications_page();}).html('<div class="nav_button_alert"></div><img src="images/'+formvote_images.icon_4+'.png"/>').formvote_buttons();
	$('.profile_img_wrapper').bind(press_event, function(){load_profile_feed(public);}).formvote_buttons();
	$('.nav_button_icon').formvote_buttons();
	$('.nav_button_icon .bubble').attr('src','images/'+formvote_images.post_icon+'.png').siblings('.back').attr('src','images/'+formvote_images.back_icon+'.png');
	$('.image_wrapper').bind('click', function(){history.back();}).bind('swipeleft',function(){gallery_switch('right');}).bind('swiperight',function(){gallery_switch('left');});
	$('.feed_switcher .reload img').attr('src','images/'+formvote_images.home_reload+'.png');
	$('.feed_switcher .tab').formvote_buttons().siblings('.reload').formvote_buttons();
	$('.navigation_bar_home .back_button').bind(press_event,function(){load_intro_page('home');}).html('<img src="images/'+formvote_images.back_icon+'.png"/>').formvote_buttons();
	$('.navigation_bar_home .logo').html('<img src="images/'+formvote_images.home_logo+'.png"/>');
	$('.home_content .button').formvote_buttons();
	$('.navigation_bar_home .button_wrapper .button').formvote_buttons();
	$('.home_content .input_set .block input').blur(function(){ios_fixed_patch();});
	$(document).bind('pageshow',function(){clear_everything();});
	returning_user();
});
function onDeviceReady()
{
}

function generate_select(type,object)
{
	var content;
	if(type=='gender')
	{
		content='<select name="info[gender]">';
		if(!object.settings_data.gender){content+='<option value="none" selected>Edit Gender</option>';}
		for(var i=0;i<object.settings_values.gender_values.length;i++)
		{
			name=object.settings_values.gender_values[i].name;
			value=object.settings_values.gender_values[i].value;
			content+='<option value="'+value+'"';
			if(object.settings_data.gender==value){content+=' selected';}
			content+='>'+name+'</option>';
		}
		content+='</select>';
	}
	else if(type=='race')
	{
		content='<select name="info[race]">';
		if(!object.settings_data.race){content+='<option value="none" selected>Edit Race/Eth</option>';}
		for(var i=0;i<object.settings_values.race_values.length;i++)
		{
			name=object.settings_values.race_values[i].name;
			value=object.settings_values.race_values[i].value;
			content+='<option value="'+value+'"';
			if(object.settings_data.race==value){content+=' selected';}
			content+='>'+name+'</option>';
		}
		content+='</select>';
	}
	else if(type=='country')
	{
		content='<select name="info[country]">';
		if(!object.settings_data.country){content+='<option value="none" selected>Edit Country</option>';}
		for(var i=0;i<object.settings_values.country_values.length;i++)
		{
			name=object.settings_values.country_values[i].name;
			value=object.settings_values.country_values[i].value;
			content+='<option value="'+value+'"';
			if(object.settings_data.country==value){content+=' selected';}
			content+='>'+name+'</option>';
		}
		content+='</select>';
	}
	else if(type=='state')
	{
		content='<select name="info[state]">';
		if(!object.settings_data.state){content+='<option value="none" selected>Edit State</option>';}
		for(var i=0;i<object.settings_values.state_values.length;i++)
		{
			name=object.settings_values.state_values[i].name;
			value=object.settings_values.state_values[i].value;
			content+='<option value="'+value+'"';
			if(object.settings_data.state==value){content+=' selected';}
			content+='>'+name+'</option>';
		}
		content+='</select>';
	}
	else if(type=='education')
	{
		content='<select name="info[education]">';
		if(!object.settings_data.education){content+='<option value="none" selected>Edit Education</option>';}
		for(var i=0;i<object.settings_values.education_values.length;i++)
		{
			name=object.settings_values.education_values[i].name;
			value=object.settings_values.education_values[i].value;
			content+='<option value="'+value+'"';
			if(object.settings_data.education==value){content+=' selected';}
			content+='>'+name+'</option>';
		}
		content+='</select>';
	}
	else if(type=='kids')
	{
		content='<select name="info[kids]">';
		if(!object.settings_data.kids){content+='<option value="none" selected>Edit Kids</option>';}
		for(var i=0;i<object.settings_values.kids_values.length;i++)
		{
			name=object.settings_values.kids_values[i].name;
			value=object.settings_values.kids_values[i].value;
			content+='<option value="'+value+'"';
			if(object.settings_data.kids==value){content+=' selected';}
			content+='>'+name+'</option>';
		}
		content+='</select>';
	}
	else if(type=='marital')
	{
		content='<select name="info[marital]">';
		if(!object.settings_data.marital){content+='<option value="none" selected>Edit Marital</option>';}
		for(var i=0;i<object.settings_values.marital_values.length;i++)
		{
			name=object.settings_values.marital_values[i].name;
			value=object.settings_values.marital_values[i].value;
			content+='<option value="'+value+'"';
			if(object.settings_data.marital==value){content+=' selected';}
			content+='>'+name+'</option>';
		}
		content+='</select>';
	}
	else if(type=='bdate')
	{
		function pad(number){return(number<10?'0':'')+number}
		var date_piece=(object.settings_data.bdate)?object.settings_data.bdate.split("-"):false;
		var content='<select name="info[month]">';
		if(!object.settings_data.bdate){content+='<option value="none" selected>Month</option>';}
		for(var i=0;i<object.settings_values.month_values.length;i++)
		{
			var name=object.settings_values.month_values[i].name;
			var value=object.settings_values.month_values[i].value;
			content+='<option value="'+value+'"';
			if(date_piece[1]==value){content+=' selected';}
			content+='>'+name+'</option>';
		}
		content+='</select>';
		content+='<select name="info[day]">';
		if(!object.settings_data.bdate){content+='<option value="none" selected>Day</option>';}
		for(var i=1;i<=31;i++)
		{
			content+='<option value="'+pad(i)+'"';
			if(date_piece[2]==pad(i)){content+=' selected';}
			content+='>'+pad(i)+'</option>';
		}
		content+='</select>';
		content+='<select name="info[year]">';
		if(!object.settings_data.bdate){content+='<option value="none" selected>Year</option>';}
		for(var i=1999;i>=1890;i--)
		{
			content+='<option value="'+i+'"';
			if(date_piece[0]==i){content+=' selected';}
			content+='>'+i+'</option>';
		}
		content+='</select>';
	}
	else if(type=='register_bdate')
	{
		function pad(number){return(number<10?'0':'')+number}
		var content='<select name="bdate[month]">';
		content+='<option value="none" selected>Month</option>'
		for(var i=0;i<object.settings_values.month_values.length;i++)
		{
			var name=object.settings_values.month_values[i].name;
			var value=object.settings_values.month_values[i].value;
			content+='<option value="'+value+'">'+name+'</option>';
		}
		content+='</select>';
		content+='<select name="bdate[year]">';
		content+='<option value="none" selected>Year</option>';
		for(var i=2013;i>=1890;i--)
		{
			content+='<option value="'+i+'">'+i+'</option>';
		}
		content+='</select>';
		content+='<select name="bdate[day]">';
		content+='<option value="none" selected>Day</option>';
		for(var i=1;i<=31;i++)
		{
			content+='<option value="'+pad(i)+'">'+pad(i)+'</option>';
		}
		content+='</select>';
	}
	return content;
}
function doVote(pid,vid)
{
	$.ajax({
		url:'http://www.formvote.com/mobile/vote_api_v2.php',
		type:'POST',
		dataType:'json',
		data:{'pid':public,'phid':phone,'postid':pid,'vid':vid},
		success:function(object)
		{
			if(object.success)
			{
				$('.post_'+pid+' .option_'+vid).html(object.votes);
			}
			else
			{
				showMessage(object.message);
			}
		}
	});
}
function layout_messages_sessions(object)
{
	var content='';
	var new_data='';
	var old_data='';
	if(object.messages_data)
	{
		for(var i=0;i<object.messages_data.length;i++)
		{
			var active=object.messages_data[i].active;
			var temp_data='';
			temp_data+='<div class="block" onclick="load_mes_ses_page(\''+object.messages_data[i].puid+'\');">';
			temp_data+='<img class="profile_image" src="http://www.formvote.com/x/profile_images/'+object.messages_data[i].puid+'/picture.jpg?v='+object.messages_data[i].ucache+'">';
			temp_data+='<div class="text">';
			temp_data+='<span class="name">'+object.messages_data[i].name+'</span><span class="blue">&lt;'+object.messages_data[i].uname+'&gt;</span>';
			temp_data+='<div class="lblack">'+object.messages_data[i].message+'</div>';
			temp_data+='<div class="info"><img class="icon" src="images/message_icon_'+object.messages_data[i].direction+'.png">'+object.messages_data[i].time_ago+'</div>';
			temp_data+='</div></div>';
			if(active===true){new_data+=temp_data;}else{old_data+=temp_data;}
		}
		new_data=(new_data)?'<div class="notifications_tab">New Messages</div><div class="notifications_set">'+new_data+'</div>':false;
		old_data=(old_data)?'<div class="notifications_set">'+old_data+'</div>':false;
		if(new_data){content+=new_data;}if(old_data){if(new_data){content+='<div class="notifications_tab">Older</div>';}content+=old_data;}
	}
	else
	{
		content+='<div class="submenu_header message">No Messages Available</div>';
	}
	return content;
}
function layout_notifications(object)
{
	var content='';
	var new_data='';
	var old_data='';
	if(object.notifications_data)
	{
		for(var i=0;i<object.notifications_data.length;i++)
		{
			var block_type=object.notifications_data[i].type;
			var active=object.notifications_data[i].active;
			var ownership=object.notifications_data[i].ownership;
			var temp_data='';
			
			temp_data+='<div class="block '+block_type;
			if(block_type=='add'){temp_data+=' add_'+object.notifications_data[i].puid;}
			temp_data+='">';
			temp_data+='<img class="profile_image" src="http://www.formvote.com/x/profile_images/'+object.notifications_data[i].puid+'/picture.jpg?v='+object.notifications_data[i].ucache+'" onclick="load_profile_feed(\''+object.notifications_data[i].puid+'\');">';
			temp_data+='<div class="text">';
			if(block_type=='comment')
			{
				temp_data+='<span class="blue" onclick="load_profile_feed(\''+object.notifications_data[i].puid+'\');">'+object.notifications_data[i].uname+'</span> wrote on ';
				temp_data+=(ownership=='your')?ownership+' ':'<span class="blue">'+ownership+'</span> ';
				temp_data+='post: <span class="lblack" onclick="load_comments_page(\''+object.notifications_data[i].ppid+'\');">'+object.notifications_data[i].message+'</span>';
			}
			else if(block_type=='like')
			{
				temp_data+='<span class="blue" onclick="load_profile_feed(\''+object.notifications_data[i].puid+'\');">'+object.notifications_data[i].uname+'</span> <span onclick="load_likes_page(\''+object.notifications_data[i].ppid+'\');">likes</span> your post: ';
				temp_data+='<span class="lblack" onclick="load_comments_page(\''+object.notifications_data[i].ppid+'\');">"'+object.notifications_data[i].message+'"</span>';
			}
			else if(block_type=='fb_friend')
			{
				temp_data+='Your Facebook Friend <span class="blue" onclick="load_profile_feed(\''+object.notifications_data[i].puid+'\');">'+object.notifications_data[i].name+'</span> just joined Formvote ';
				temp_data+='as <span class="blue" onclick="load_profile_feed(\''+object.notifications_data[i].puid+'\');">&lt;'+object.notifications_data[i].uname+'&gt;</span>';
			}
			else if(block_type=='add')
			{
				temp_data+='<span class="blue" onclick="load_profile_feed(\''+object.notifications_data[i].puid+'\');">'+object.notifications_data[i].uname+'</span> sent you a friend request.';
				temp_data+='<div class="add_buttons"><input type="button" class="accept" value="Accept" onclick="userFunction(\'friend_add\',\''+object.notifications_data[i].puid+'\');"><input type="button" value="Deny" onclick="userFunction(\'friend_deny\',\''+object.notifications_data[i].puid+'\');"></div>';
			}
			temp_data+='<div class="info"><img class="icon" src="images/notification_icon_'+block_type+'.png">'+object.notifications_data[i].time_ago+'</div>';
			temp_data+='</div></div>';
			if(active===true){new_data+=temp_data;}else{old_data+=temp_data;}
		}
		new_data=(new_data)?'<div class="notifications_tab">Recent News</div><div class="notifications_set">'+new_data+'</div>':false;
		old_data=(old_data)?'<div class="notifications_set">'+old_data+'</div>':false;
		if(new_data){content+=new_data;}if(old_data){if(new_data){content+='<div class="notifications_tab">Older</div>';}content+=old_data;}
	}
	else
	{
		content+='<div class="submenu_header message">No News Available</div>';
	}
	return content;
}
function layout_profile(object)
{
	var content='';
	if(object.profile)
	{
		content+='<div class="profile_block">';
		content+='<div class="cover"';
		if(object.profile.cover_image)
		{
			var image_object=process_image('question',object.profile.cover_image.w,object.profile.cover_image.h,null);
			content+=' style="background-image:url(http://www.formvote.com/x/profile_images/'+object.profile.puid+'/h_picture.jpg?v='+object.profile.ucache+');';
			if(image_object.negative_top){content+='background-position:center '+image_object.negative_top+'%;';}
			content+='height:'+image_object.height+'px;"';
		}
		content+='>';
		content+='<div class="user_info"><span class="name">'+object.profile.name+'</span><span class="username">&lt;'+object.profile.uname+'&gt;</span></div></div>';
		content+='<div class="user_actions">';
		content+='<div class="count_block" onclick="$(document).scrollTop($(\'.profile_block\').height());"><div>'+object.profile.total_posts+'</div><div>Post';
		if(object.profile.total_posts!=1){content+='s';}
		content+='</div></div>';
		content+='<div class="count_block"';
		if(object.profile.total_friends>0&&object.profile.permission===true){content+=' onclick="load_friends_page(\''+object.profile.puid+'\');"';}
		content+='><div>'+object.profile.total_friends+'</div><div>Friend';
		if(object.profile.total_friends!=1){content+='s';}
		content+='</div></div>';
		var button_class=(object.profile.puid!=public)?'buttons':'buttons single';
		content+='<div class="'+button_class+'">';
		if(object.profile.puid!=public)
		{
			content+='<div class="more"><input type="button" value="..." onclick="hover_menu({type:\'user\',puid:\''+object.profile.puid+'\'});"></div>';
			if(object.profile.friends==true)
			{
				content+='<div class="add friends"><input type="button" value="Friends" onclick="userFunction(\'remove\',\''+object.profile.puid+'\');"></div>';
			}
			else
			{
				var button_text=(object.profile.friends=='requested')?'Requested':'Add Friend';
				var button_function=(object.profile.friends=='respond')?'load_notifications_page();':'userFunction(\'add\',\''+object.profile.puid+'\');';
				content+='<div class="add"><input type="button" value="'+button_text+'" onclick="'+button_function+'"></div>';
			}
		}
		else{content+='<div class="account" onclick="hover_menu({type:\'account\'});">Edit Account<img class="arrow" src="images/arr_right_profile.png" /></div>';}
		content+='</div>';
		content+='</div>';
		var age=object.profile.age,gender=object.profile.gender,location=object.profile.location,about=object.profile.about;
		if(age||gender||location||about)
		{
			content+='<div class="profile_info">';
			if(about){content+='<div class="bio">'+about+'</div>';}
			if(age||gender||location)
			{
				content+='<div class="stats">';
				if(age){content+='<div>'+age+'</div>';if(!gender&&!location){content+=' Years Old';}}
				if(gender){if(age){content+='<div class="dot">•</div>';}content+='<div class="gender">'+gender+'</div>';}
				if(location){if(gender||age){content+='<div class="dot">•</div>';}content+='<div>'+location+'</div>';}
				content+='</div>';
			}
			content+='</div>';
		}
		if(object.profile.site)
		{
			content+='<div class="website">'+object.profile.site+'</div>';
		}
		content+='</div>';
	}
	return content;
}
function layout_post(object,section)
{
	var content='';
	for(var i=0;i<object.data.length;i++)
	{
		switch(section)
		{
			case 'public':
			public_feed_last_post=object.data[i].time_raw;
			break;
			case 'friends':
			friends_feed_last_post=object.data[i].time_raw;
			break;
			case 'profile':
			profile_feed_last_post=object.data[i].time_raw;
			break;
		}
		content+='<div class="formvote_post_block post_'+object.data[i].pid+'">';
		content+='<div class="head">';
		content+='<img class="profile_image" src="http://www.formvote.com/x/profile_images/'+object.data[i].puid+'/small_picture.jpg?v='+object.data[i].u_cache+'" onclick="load_profile_feed(\''+object.data[i].puid+'\');" />';
		content+='<div class="head_text">';
		content+='<div class="owner" onclick="load_profile_feed(\''+object.data[i].puid+'\');">'+object.data[i].uname+'</div>';
		content+='<div class="timestamp">'+object.data[i].time_ago+'</div>';
		content+='</div>';
		content+='<img class="discuss_icon" src="images/discuss_ic.png" onclick="load_comments_page(\''+object.data[i].ppid+'\');" />';
		if(object.data[i].puid!=public)
		{
			if(object.data[i].like)
			{
				content+='<img class="like_icon" src="images/like2_ic.png" onclick="postFunction(\'unlike\',\''+object.data[i].pid+'\');" />';
			}
			else
			{
				content+='<img class="like_icon" src="images/like_ic.png" onclick="postFunction(\'like\',\''+object.data[i].pid+'\');" />';
			}
		}
		content+='</div>';
		if(object.data[i].q_img_url || object.data[i].q_vid_url)
		{
			if(object.data[i].q_img_url && !object.data[i].q_vid_url)
			{
				var image_object=process_image('question',object.data[i].q_img_dimensions.w,object.data[i].q_img_dimensions.h);
				content+='<div class="q_image" style="background-image:url(http://www.formvote.com/mobile/resize.php?src=http://www.formvote.com/x/profile_images/'+object.data[i].puid+'/uploads/'+object.data[i].q_img_url+'&w=400&q=55);background-size:cover;';
				if(image_object.negative_top){content+='background-position:center '+image_object.negative_top+'%;';}
				content+='height:'+image_object.height+'px;';
				content+='" onclick="open_gallery(\'question\',\''+object.data[i].pid+'\',0);"></div>';
			}
			else
			{
				content+='<a href="http://www.youtube.com/watch?v='+object.data[i].q_vid_url+'" target="_blank">';
				content+='<div class="q_image" style="background-image:url(http://www.formvote.com/mobile/resize.php?src=http://www.formvote.com/x/profile_images/'+object.data[i].puid+'/uploads/'+object.data[i].q_img_url+'&w=400&q=55);background-size:cover;"><img class="youtube_button" src="images/youtube_play_button.png" /></div>';
				content+='</a>';
			}
		}
		content+='<div class="q_text">'+object.data[i].q_text+'</div>';
		if(object.data[i].a_media)
		{
			var layout_odd=function(){if(object.data[i].a_media && object.data[i].a_amount==3 || object.data[i].a_amount==5){return true;}return false;};
			content+='<div class="image_options';
			if(layout_odd()){content+=' layout_odd';}
			content+='">';
			var options_height=process_image('options_height',null,null,object.data[i].answers);
			for(a=0;a<object.data[i].answers.length;a++)
			{
				content+='<div class="set">';
				if(object.data[i].answers[a].a_img_url || object.data[i].answers[a].a_vid_url)
				{
					if(object.data[i].answers[a].a_img_url && !object.data[i].answers[a].a_vid_url)
					{
						var image_object=process_image('option',object.data[i].answers[a].a_img_dimensions.w,object.data[i].answers[a].a_img_dimensions.h,null);
						content+='<div class="image_block" style="background-image:url(http://www.formvote.com/mobile/resize.php?src=http://www.formvote.com/x/profile_images/'+object.data[i].puid+'/uploads/'+object.data[i].answers[a].a_img_url+'&w=';
						if(layout_odd() && a==0){content+='400';}else{content+='240';}
						content+='&q=55);background-size:cover;';
						if(image_object.negative_top){content+='background-position:center '+image_object.negative_top+'%;';}
						content+='height:'+options_height.height+'px;';
						content+='" onclick="open_gallery(\'option\',\''+object.data[i].pid+'\',\''+object.data[i].answers[a].a_vote_id+'\');"></div>';
					}
					else
					{
						content+='<a href="http://www.youtube.com/watch?v='+object.data[i].answers[a].a_vid_url+'" target="_blank">';
						content+='<div class="image_block" style="background-image:url(http://www.formvote.com/mobile/resize.php?src=http://www.formvote.com/x/profile_images/'+object.data[i].puid+'/uploads/'+object.data[i].answers[a].a_img_url+'&w=';
						if(layout_odd() && a==0){content+='400';}else{content+='240';}
						content+='&q=55);background-size:cover;';
						content+='height:'+options_height.height+'px;';
						content+='"><img class="youtube_button" src="images/youtube_play_button_s.png" /></div>';
						content+='</a>';
					}
				}
				else
				{
					content+='<div class="image_block" style="height:'+options_height.height+'px;"></div>';
				}		
				content+='<div class="subset" onclick="doVote(\''+object.data[i].pid+'\',\''+object.data[i].answers[a].a_vote_id+'\');">';
				content+='<div class="a_vote option_'+object.data[i].answers[a].a_vote_id+'">'+object.data[i].answers[a].a_votes+'</div>';
				content+='<div class="a_text ">'+object.data[i].answers[a].a_text+'</div>';
				content+='</div>';
				content+='</div>';
			}
			content+='</div>';
		}
		else
		{
			content+='<div class="text_options">';
			for(a=0;a<object.data[i].answers.length;a++)
			{
				content+='<div class="set" onclick="doVote(\''+object.data[i].pid+'\',\''+object.data[i].answers[a].a_vote_id+'\');">';
				content+='<div class="a_vote option_'+object.data[i].answers[a].a_vote_id+'">'+object.data[i].answers[a].a_votes+'</div>';
				content+='<div class="a_text">'+object.data[i].answers[a].a_text+'</div>';
				content+='</div>';
			}
			content+='</div>';
		}
		content+='<div class="info_bar">';
		if(object.data[i].total_diss || object.data[i].total_like)
		{
			if(object.data[i].total_diss)
			{
				content+='<div class="info_text discuss" onclick="load_comments_page(\''+object.data[i].ppid+'\');">';
				content+='<img class="icon" src="images/info_d_icon.png" />';
				content+='<span>';
				content+=object.data[i].total_diss+' Comment';
				if(object.data[i].total_diss>1){content+='s';}
				content+='</span></div>';
			}
			if(object.data[i].total_like)
			{
				content+='<div class="info_text like" onclick="load_likes_page(\''+object.data[i].ppid+'\');">';
				content+='<img class="icon" src="images/info_l_icon.png" />';
				content+='<span>';
				content+=object.data[i].total_like+' Like';
				if(object.data[i].total_like>1){content+='s';}
				content+='</span></div>';
			}
		}
		content+='<div class="drop_down" onclick="hover_menu({type:\'post\',pid:\''+object.data[i].pid+'\',owner:'+object.data[i].owner+'});"></div>';
		content+='</div>';
		content+='</div>';
	}
	return content;
}
function layout_intro_post(object)
{
	var content='';
	for(var i=0;i<object.data.length;i++)
	{
		content+='<div class="formvote_post_block post_'+object.data[i].pid+'">';
		content+='<div class="head">';
		content+='<img class="profile_image" src="http://www.formvote.com/x/profile_images/'+object.data[i].puid+'/small_picture.jpg?v='+object.data[i].u_cache+'" onclick="load_intro_page(\'register\')" />';
		content+='<div class="head_text">';
		content+='<div class="owner" onclick="load_intro_page(\'register\')">'+object.data[i].uname+'</div>';
		content+='<div class="timestamp">'+object.data[i].time_ago+'</div>';
		content+='</div>';
		content+='<img class="discuss_icon" src="images/discuss_ic.png" onclick="load_intro_page(\'register\')" />';
		if(object.data[i].puid!=public)
		{
			if(object.data[i].like)
			{
				content+='<img class="like_icon" src="images/like2_ic.png" onclick="load_intro_page(\'register\')" />';
			}
			else
			{
				content+='<img class="like_icon" src="images/like_ic.png" onclick="load_intro_page(\'register\')" />';
			}
		}
		content+='</div>';
		if(object.data[i].q_img_url || object.data[i].q_vid_url)
		{
			if(object.data[i].q_img_url && !object.data[i].q_vid_url)
			{
				var image_object=process_image('question',object.data[i].q_img_dimensions.w,object.data[i].q_img_dimensions.h);
				content+='<div class="q_image" style="background-image:url(http://www.formvote.com/mobile/resize.php?src=http://www.formvote.com/x/profile_images/'+object.data[i].puid+'/uploads/'+object.data[i].q_img_url+'&w=400&q=55);background-size:cover;';
				if(image_object.negative_top){content+='background-position:center '+image_object.negative_top+'%;';}
				content+='height:'+image_object.height+'px;';
				content+='" onclick="open_gallery(\'question\',\''+object.data[i].pid+'\',0);"></div>';
			}
			else
			{
				content+='<a href="http://www.youtube.com/watch?v='+object.data[i].q_vid_url+'" target="_blank">';
				content+='<div class="q_image" style="background-image:url(http://www.formvote.com/mobile/resize.php?src=http://www.formvote.com/x/profile_images/'+object.data[i].puid+'/uploads/'+object.data[i].q_img_url+'&w=400&q=55);background-size:cover;"><img class="youtube_button" src="images/youtube_play_button.png" /></div>';
				content+='</a>';
			}
		}
		content+='<div class="q_text">'+object.data[i].q_text+'</div>';
		if(object.data[i].a_media)
		{
			var layout_odd=function(){if(object.data[i].a_media && object.data[i].a_amount==3 || object.data[i].a_amount==5){return true;}return false;};
			content+='<div class="image_options';
			if(layout_odd()){content+=' layout_odd';}
			content+='">';
			var options_height=process_image('options_height',null,null,object.data[i].answers);
			for(a=0;a<object.data[i].answers.length;a++)
			{
				content+='<div class="set">';
				if(object.data[i].answers[a].a_img_url || object.data[i].answers[a].a_vid_url)
				{
					if(object.data[i].answers[a].a_img_url && !object.data[i].answers[a].a_vid_url)
					{
						var image_object=process_image('option',object.data[i].answers[a].a_img_dimensions.w,object.data[i].answers[a].a_img_dimensions.h,null);
						content+='<div class="image_block" style="background-image:url(http://www.formvote.com/mobile/resize.php?src=http://www.formvote.com/x/profile_images/'+object.data[i].puid+'/uploads/'+object.data[i].answers[a].a_img_url+'&w=';
						if(layout_odd() && a==0){content+='400';}else{content+='240';}
						content+='&q=55);background-size:cover;';
						if(image_object.negative_top){content+='background-position:center '+image_object.negative_top+'%;';}
						content+='height:'+options_height.height+'px;';
						content+='" onclick="open_gallery(\'option\',\''+object.data[i].pid+'\',\''+object.data[i].answers[a].a_vote_id+'\');"></div>';
					}
					else
					{
						content+='<a href="http://www.youtube.com/watch?v='+object.data[i].answers[a].a_vid_url+'" target="_blank">';
						content+='<div class="image_block" style="background-image:url(http://www.formvote.com/mobile/resize.php?src=http://www.formvote.com/x/profile_images/'+object.data[i].puid+'/uploads/'+object.data[i].answers[a].a_img_url+'&w=';
						if(layout_odd() && a==0){content+='400';}else{content+='240';}
						content+='&q=55);background-size:cover;';
						content+='height:'+options_height.height+'px;';
						content+='"><img class="youtube_button" src="images/youtube_play_button_s.png" /></div>';
						content+='</a>';
					}
				}
				else
				{
					content+='<div class="image_block" style="height:'+options_height.height+'px;"></div>';
				}		
				content+='<div class="subset" onclick="load_intro_page(\'register\')">';
				content+='<div class="a_vote option_'+object.data[i].answers[a].a_vote_id+'">'+object.data[i].answers[a].a_votes+'</div>';
				content+='<div class="a_text ">'+object.data[i].answers[a].a_text+'</div>';
				content+='</div>';
				content+='</div>';
			}
			content+='</div>';
		}
		else
		{
			content+='<div class="text_options">';
			for(a=0;a<object.data[i].answers.length;a++)
			{
				content+='<div class="set" onclick="load_intro_page(\'register\')">';
				content+='<div class="a_vote option_'+object.data[i].answers[a].a_vote_id+'">'+object.data[i].answers[a].a_votes+'</div>';
				content+='<div class="a_text">'+object.data[i].answers[a].a_text+'</div>';
				content+='</div>';
			}
			content+='</div>';
		}
		content+='<div class="info_bar">';
		if(object.data[i].total_diss || object.data[i].total_like)
		{
			if(object.data[i].total_diss)
			{
				content+='<div class="info_text discuss" onclick="load_intro_page(\'register\')">';
				content+='<img class="icon" src="images/info_d_icon.png" />';
				content+='<span>';
				content+=object.data[i].total_diss+' Comment';
				if(object.data[i].total_diss>1){content+='s';}
				content+='</span></div>';
			}
			if(object.data[i].total_like)
			{
				content+='<div class="info_text like" onclick="load_intro_page(\'register\')">';
				content+='<img class="icon" src="images/info_l_icon.png" />';
				content+='<span>';
				content+=object.data[i].total_like+' Like';
				if(object.data[i].total_like>1){content+='s';}
				content+='</span></div>';
			}
		}
		content+='<div class="drop_down" onclick="load_intro_page(\'register\')"></div>';
		content+='</div>';
		content+='</div>';
	}
	return content;
}
function layout_comments(object)
{
	var content='';
	content+='<div class="formvote_comments">';
	content+='<div class="content"';
	if(!object.comments_data){content+=' style="display:none;"';}
	content+='>';
	content+='<div class="session">';
	if(object.more){content+='<div class="load_more" onclick="comments_load_more(\''+object.data[0].ppid+'\')">View Previous Comments</div>';}
	content+='<div class="feed">';
	if(object.comments_data)
	{
		discussion_feed_last_post=object.comments_data[0].time_raw;
		for(var i=0;i<object.comments_data.length;i++)
		{
			var puid=object.comments_data[i].puid;
			content+='<div class="block">';
			content+='<img class="profile_image" src="http://www.formvote.com/x/profile_images/'+puid+'/picture.jpg?v='+object.comments_data[i].ucache+'" onclick="load_profile_feed(\''+puid+'\');">';
			content+='<div class="text"><span class="blue" onclick="load_profile_feed(\''+puid+'\');">'+object.comments_data[i].uname+'</span><span class="timestamp">'+object.comments_data[i].time_ago+'</span>';
			content+='<div>'+object.comments_data[i].message+'</div>';
			content+='</div></div>';
		}
	}
	content+='</div>';
	content+='</div></div>';
	content+='<form data-ajax="false" onsubmit="dis_po(\''+object.data[0].ppid+'\'); return false;"><div class="input_wrapper">';
	content+='<div class="button_wrapper"><input type="submit" value="Send"></div>';
	content+='<div class="textarea_wrapper"><textarea placeholder="Write a comment..."></textarea></div>';
	content+='</div></form>';
	content+='</div>';
	return content;
}
function layout_comments_feed(object)
{
	var content='';
	if(object.comments_data)
	{
		discussion_feed_last_post=object.comments_data[0].time_raw;
		for(var i=0;i<object.comments_data.length;i++)
		{
			var puid=object.comments_data[i].puid;
			content+='<div class="block">';
			content+='<img class="profile_image" src="http://www.formvote.com/x/profile_images/'+puid+'/picture.jpg?v='+object.comments_data[i].ucache+'" onclick="load_profile_feed(\''+puid+'\');">';
			content+='<div class="text"><span class="blue" onclick="load_profile_feed(\''+puid+'\');">'+object.comments_data[i].uname+'</span><span class="timestamp">'+object.comments_data[i].time_ago+'</span>';
			content+='<div>'+object.comments_data[i].message+'</div>';
			content+='</div></div>';
		}
	}
	return content;
}
function layout_messages(object)
{
	var content='';
	content+='<div class="formvote_messages">';
	content+='<div class="content"';
	if(!object.messages_data){content+=' style="display:none;"';}
	content+='>';
	if(object.more){content+='<div class="load_more" onclick="messages_load_more(\''+object.user_data.puid+'\');">View Previous Messages</div>';}
	content+='<div class="feed">';
	if(object.messages_data)
	{
		messages_feed_last_post=object.messages_data[0].time_raw;
		for(var i=0;i<object.messages_data.length;i++)
		{
			var puid=object.messages_data[i].puid;
			var owner=(puid==public)?'self':'other';
			content+='<div class="block '+owner+'">';
			content+='<div class="profile_image" style="background-image:url(http://www.formvote.com/x/profile_images/'+puid+'/picture.jpg?v='+object.messages_data[i].ucache+');" onclick="load_profile_feed(\''+puid+'\');"></div>';
			content+='<div class="text_wrapper">';
			content+='<div class="bubble">'+object.messages_data[i].message+'<div class="timestamp">'+object.messages_data[i].time_ago+'</div></div>';
			content+='</div></div>';
		}
	}
	content+='</div></div>';
	content+='<div class="messages_tab"';
	if(!object.messages_data){content+=' style="display:block;"';}
	content+='>Compose New Message</div>';
	content+='<div class="action_bar"><div class="session_info"><span class="name">'+object.user_data.name+'</span><span class="blue">&lt;'+object.user_data.uname+'&gt;</span></div>';
	content+='<form data-ajax="false" onsubmit="mes_po(\''+object.user_data.puid+'\'); return false;"><div class="input_wrapper">';
	content+='<div class="button_wrapper"><input type="submit" value="Send"></div>';
	content+='<div class="textarea_wrapper"><textarea placeholder="Write a message..."></textarea></div>';
	content+='</div></form>';
	content+='</div></div>';
	return content;
}
function layout_messages_feed(object)
{
	var content='';
	if(object.messages_data)
	{
		messages_feed_last_post=object.messages_data[0].time_raw;
		for(var i=0;i<object.messages_data.length;i++)
		{
			var puid=object.messages_data[i].puid;
			var owner=(puid==public)?'self':'other';
			content+='<div class="block '+owner+'">';
			content+='<div class="profile_image" style="background-image:url(http://www.formvote.com/x/profile_images/'+puid+'/picture.jpg?v='+object.messages_data[i].ucache+');" onclick="load_profile_feed(\''+puid+'\');"></div>';
			content+='<div class="text_wrapper">';
			content+='<div class="bubble">'+object.messages_data[i].message+'<div class="timestamp">'+object.messages_data[i].time_ago+'</div></div>';
			content+='</div></div>';
		}
	}
	return content;
}
function layout_search_results(object)
{
	var content='';
	if(object.search_data)
	{
		for(var i=0;i<object.search_data.length;i++)
		{
			content+='<div class="formvote_user_block" onclick="load_profile_feed(\''+object.search_data[i].pid+'\');">';
			content+='<img class="profile_image" src="http://www.formvote.com/x/profile_images/'+object.search_data[i].pid+'/picture.jpg?v='+object.search_data[i].ucache+'">';
			content+='<div class="text_block">';
			content+='<div>'+object.search_data[i].name+'</div>';
			content+='<div><span class="blue">'+object.search_data[i].uname+'</span></div>';
			content+='</div>';
			content+='</div>';
		}
	}
	else
	{
		content+='<div class="feed_message_block">No members found.</div>';
	}
	return content;
}
function layout_likes(object)
{
	var content='';
	content+='<div class="submenu_header">'+object.likes_data.length+' Like';
	if(object.likes_data.length!=1){content+='s';}
	content+='</div>';
	if(object.likes_data)
	{
		content+='<div class="block_wrapper">';
		for(var i=0;i<object.likes_data.length;i++)
		{
			content+='<div class="formvote_user_block" onclick="load_profile_feed(\''+object.likes_data[i].pid+'\');">';
			content+='<img class="profile_image" src="http://www.formvote.com/x/profile_images/'+object.likes_data[i].pid+'/picture.jpg?v='+object.likes_data[i].ucache+'">';
			content+='<div class="text_block">';
			content+='<div>'+object.likes_data[i].name+'</div>';
			content+='<div><span class="blue">'+object.likes_data[i].uname+'</span></div>';
			content+='</div>';
			content+='</div>';
		}
		content+='</div>';
	}
	else
	{
		content+='<div class="block_wrapper"><div class="formvote_user_block empty">Nobody has liked this post.</div></div>';
	}
	return content;
}
function layout_settings(object,type)
{
	private=(object.settings_data.private)?'private':'public';
	switch(type)
	{
		case 'basic':setting_title='Settings';break;
		case 'info':setting_title='Info Settings';break;
		case 'privacy':setting_title='Privacy Settings';break;
	}
	var content='';
	content+='<form id="st_form_'+type+'" data-ajax="false" onsubmit="settings_save(\''+type+'\'); return false;">';
	content+='<div class="settings_header">'+setting_title+'<input class="save_button '+type+'" type="submit" value="Save"></div>';
	content+='<div class="block_wrapper">';
	if(type=="basic")
	{
		content+='<div class="settings_block">';
		content+='<div class="row"><div class="title">Username</div><div class="value solid">'+object.settings_data.uname+'</div></div>';
		content+='<div id="st_name" class="row" onclick="setting_change(\''+type+'\',\'name\');"><div class="title">Name</div><div class="value">'+object.settings_data.name+'</div></div>';
		content+='<div id="st_email" class="row" onclick="setting_change(\''+type+'\',\'email\');"><div class="title">Email</div><div class="value">'+object.settings_data.email+'</div></div>';
		content+='<div id="st_website" class="row" onclick="setting_change(\''+type+'\',\'website\');"><div class="title">Website</div><div class="value">'+object.settings_data.website+'</div></div>';
		content+='</div>';
	
		content+='<div class="settings_block">';
		content+='<div id="st_picture" class="row except" onclick="hover_menu({type:\'camera\',camera_target:\'profile_picture\'});"><div class="title">Profile Picture</div><div class="value"><img src="http://www.formvote.com/x/profile_images/'+object.settings_data.pid+'/picture.jpg?v='+object.settings_data.ucache+'"></div><div id="st_ldr_picture" class="loader"></div></div>';
		content+='<div id="st_private" class="row except"><div class="title">Account Privacy</div><div class="value"><input class="'+private+'" type="button" value="'+private+'" onclick="setting_change(\''+type+'\',\'private\');"></div></div>';
		content+='<div id="st_about" class="row" onclick="setting_change(\''+type+'\',\'about\');"><div class="title">Bio</div><div class="value">'+object.settings_data.about+'</div></div>';
		content+='</div>';
		
		content+='<div class="tap_button" onclick="load_settings_extended_page(\'info\');">Info Settings</div>';
		content+='<div class="tap_button" onclick="fb_connect_general();">Find Facebook Friends</div>';
	}
	else if(type=="info")
	{
		content+='<div class="settings_block">';
		content+='<div id="st_bdate" class="row"><div class="title">Birthdate</div><div class="value date">'+generate_select('bdate',object)+'</div></div>';
		content+='<div id="st_gender" class="row"><div class="title">Gender</div><div class="value">'+generate_select('gender',object)+'</div></div>';
		content+='<div id="st_race" class="row"><div class="title">Race/Eth</div><div class="value">'+generate_select('race',object)+'</div></div>';
		content+='<div id="st_country" class="row"><div class="title">Country</div><div class="value">'+generate_select('country',object)+'</div></div>';
		content+='<div id="st_state" class="row"';
		if(object.settings_data.country!='344'){content+=' style="display:none;"';}
		content+='><div class="title">State</div><div class="value">'+generate_select('state',object)+'</div></div>';
		content+='<div id="st_city" class="row" onclick="setting_change(\''+type+'\',\'city\');"><div class="title">City</div><div class="value">'+object.settings_data.city+'</div></div>';
		content+='<div id="st_education" class="row"><div class="title">Education</div><div class="value">'+generate_select('education',object)+'</div></div>';
		content+='<div id="st_kids" class="row"><div class="title">Kids</div><div class="value">'+generate_select('kids',object)+'</div></div>';
		content+='<div id="st_marital" class="row"><div class="title">Marital</div><div class="value">'+generate_select('marital',object)+'</div></div>';
		content+='</div>';
	}
	
	content+='</div>';
	content+='</form>';
	return content;
}
var gallery_object=null;
function open_gallery(type,post,option_value)
{
	$('.image_wrapper').css('background-image','none');
	$.mobile.changePage('#image_page',default_transition);
	$.ajax({
		url:'http://www.formvote.com/mobile/image_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'post':post,'option_value':option_value},
		success:function(object)
		{
			gallery_object=object;
			for(var i=0;i<object.images.length;i++){if(object.images[i].option_value==option_value){gallery_object.active=i;break;}}
			var url=gallery_object.images[gallery_object.active].url;
			$('.image_wrapper').css('background-image','url('+url+')');
		}
	});
}
function gallery_switch(direction)
{
	var total=gallery_object.images.length-1;
	var active=gallery_object.active;
	var url;
	var right;
	var left;
	if(direction=='right')
	{
		right=active+1;
		if(right>total)
		{
			url=gallery_object.images[0].url;
			active=0;
		}
		else
		{
			url=gallery_object.images[right].url;
			active=right;
		}
	}
	else if(direction=='left')
	{
		left=active-1;
		if(left<0)
		{
			url=gallery_object.images[total].url;
			active=total;
		}
		else
		{
			url=gallery_object.images[left].url;
			active=left;
		}
	}
	gallery_object.active=active;
	$('.image_wrapper').css('background-image','url('+url+')');
}

var t_removal;
function removeMessage()
{
	$('.information').hide();
}
function showMessage(message)
{
	clearTimeout(t_removal);
	$('.information').html(message).show();
	t_removal=setTimeout('removeMessage()',2500);
}
//
function valid(a)
{
	if(a=="notvalid")
	{
		return false;
	}
	return true;
}
function pass_inpt(obj,which)
{
	if (which == "on")
	{
		obj.setAttribute("type", "password");
	}
	if (which == "off")
	{
		if (obj.value == "")
		{
		obj.setAttribute("type", "text");
		}
	}
}
function returning_user()
{
	if(!public||!phone)
	{
		logout();
	}
	else
	{
		load_home_feed();
		load_profile_image();
		$.ajax({
			url:'http://www.formvote.com/mobile/login_api_v2.php',
			type:'POST',
			dataType:'json',
			data:{'pid':public,'phid':phone},
			success:function(object)
			{
				if(object.passed)
				{
					window.localStorage.setItem('formvote_user',JSON.stringify(object));
					formvote_user=object;
				}
			}
		});
	}
}
var $started=0;
function clear_everything()
{
	$started++;
	if($('#filler').is('.ui-page-active') && $started!=1 && device.platform=="Android"){navigator.app.exitApp();}
	clearTimeout(t_removal);
	flush_information();
	load_session();
	hover_menu('close');
	if($('#home_feed_page').is('.ui-page-active')||$('#search_page').is('.ui-page-active')||$('#messages_page').is('.ui-page-active')||$('#notifications_page').is('.ui-page-active')||$('#profile_page').is('.ui-page-active')&&profile_id==public)
	{
		$('.nav_button_icon').attr('onclick','formvote_post=false;$.mobile.changePage("#post_page",default_transition)');
		$('.nav_button_icon .back').hide().siblings('.bubble').show();
	}
	else
	{
		$('.nav_button_icon').attr('onclick','history.back()');
		$('.nav_button_icon .back').show().siblings('.bubble').hide();
	}
	if($('#login_page').is('.ui-page-active')||$('#register_page').is('.ui-page-active')){$('body').addClass('home_bg');}else{$('body').removeClass('home_bg');}
	if($('#post_page').is('.ui-page-active')){if(!formvote_post){load_post_page();}}
	if($('#home_feed_page').is('.ui-page-active')){$('.nav_button_1 img').attr('src','images/'+formvote_images.icon_1+'b.png').parent().addClass('pressed');}
	else{$('.nav_button_1 img').attr('src','images/'+formvote_images.icon_1+'.png').parent().removeClass('pressed');}
	if($('#search_page').is('.ui-page-active')){$('.nav_button_2 img').attr('src','images/'+formvote_images.icon_2+'b.png').parent().addClass('pressed');}
	else{$('.nav_button_2 img').attr('src','images/'+formvote_images.icon_2+'.png').parent().removeClass('pressed');}
	if($('#messages_page').is('.ui-page-active')||$('#mes_ses_page').is('.ui-page-active')){$('.nav_button_3 img').attr('src','images/'+formvote_images.icon_3+'b.png').parent().addClass('pressed');}
	else{$('.nav_button_3 img').attr('src','images/'+formvote_images.icon_3+'.png').parent().removeClass('pressed');}
	if($('#notifications_page').is('.ui-page-active')){$('.nav_button_4 img').attr('src','images/'+formvote_images.icon_4+'b.png').parent().addClass('pressed');}
	else{$('.nav_button_4 img').attr('src','images/'+formvote_images.icon_4+'.png').parent().removeClass('pressed');}
}
function ios_fixed_patch(){setTimeout(function(){$('body').trigger('updatelayout');$(document).scrollTop($(document).scrollTop()+1);},10);}
function load_session()
{
	$.ajax({
		url:'http://www.formvote.com/mobile/session_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone},
		success:function(object)
		{
			if(valid(object)){
			for(var i=0;i<object.data.length;i++)
			{
				if(object.data[i].amount>0)
				{
					$('.'+object.data[i].button+' .nav_button_alert').html(object.data[i].amount);
					$('.'+object.data[i].button+' .nav_button_alert').show();
				}
				else
				{
					$('.'+object.data[i].button+' .nav_button_alert').hide();
				}
			}
			}
		}
	});
}
function flush_profile_image()
{
	$('.profile_img_wrapper .profile_image').css('background-image','none');
}
function load_profile_image()
{
	$.ajax({
		url:'http://www.formvote.com/mobile/acc_data_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone},
		success:function(object)
		{
			if(valid(object))
			{
				var content='http://www.formvote.com/x/profile_images/'+object.pid+'/picture.jpg?v='+object.ucache;
				$('#st_picture .value').html('<img src="'+content+'" />');
				$('.profile_img_wrapper .profile_image').css('background-image','url('+content+')');
			}
		}
	});
}
function load_camera_options()
{
	content='<div class="button take" onclick="capturePhoto();">Take Photo</div>';
	content+='<div class="line"></div>';
	content+='<div class="button browse" onclick="getPhoto();">Browse Library</div>';
	$(".camera_buttons").html(content);
}
function flush_information()
{
	$(".information").hide();
}
function load_settings_page()
{
	$.mobile.changePage('#settings_page',default_transition);
	$.ajax({
		url:'http://www.formvote.com/mobile/settings_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone},
		beforeSend:function(){$("#settings_wrapper").html('<div class="feed_loader"></div>');},
		success:function(object)
		{
			if(valid(object))
			{
				var content=layout_settings(object,'basic');
				$('#settings_wrapper').html(content);
				$(".settings_header .save_button").hide();
			}
		}
	});
}
function load_settings_extended_page(type)
{
	$.mobile.changePage("#settings_extended_page",default_transition);
	$.ajax({
		url:'http://www.formvote.com/mobile/settings_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone},
		beforeSend:function(){$("#settings_extended_wrapper").html('<div class="feed_loader"></div>');},
		success:function(object)
		{
			if(valid(object))
			{
				var content=layout_settings(object,type);
				$('#settings_extended_wrapper').html(content);
				if(type=="info")
				{
					$('#st_form_'+type+' select').selectmenu();
					$('#st_form_'+type+' select').change(function(){
						$("#st_form_"+type+" .settings_header .save_button").show();
						$(this).parent('.ui-btn').find('span').css({'color':'#666'});
					});
					$('#st_country .value select').change(function(){
						if($(this).val()=="344"){$('#st_state').show();}else{$('#st_state').hide();}
					});
				}
			}
		}
	});
}
var discussion_feed_last_post;
function load_comments_page(ppid)
{
	$.mobile.changePage('#comments_page',default_transition);
	$.ajax({
		url:'http://www.formvote.com/mobile/discussion_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'postid':ppid},
		beforeSend:function(){$('#comments_wrapper').html('<div class="feed_loader"></div>');},
		success:function(object)
		{
			if(valid(object))
			{
				if(!object.message)
				{
					var section='comments';
					var content='<div class="feed_wrapper">'+layout_post(object,section)+'</div>';
					content+=layout_comments(object);
					$('#comments_wrapper').html(content);
					$('.formvote_comments .input_wrapper .button_wrapper input').formvote_buttons();
					$('.formvote_comments .input_wrapper .textarea_wrapper textarea').textinput().blur(function(){ios_fixed_patch();});
					$(document).scrollTop($('#comments_wrapper').height());
				}
				else
				{
					$('#comments_wrapper').html('<div class="submenu_header message">You have no messages.</div>');
				}
			}
		}
	});
}
var messages_feed_last_post;
function load_mes_ses_page(puid)
{
	$.mobile.changePage('#mes_ses_page',default_transition);
	$.ajax({
		url:'http://www.formvote.com/mobile/messages_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'puid':puid},
		beforeSend:function(){$('#mes_ses_hold').html('<div class="feed_loader"></div>');},
		success:function(object)
		{
			if(valid(object))
			{
				var content=layout_messages(object);
				$('#mes_ses_hold').html(content);
				$('.formvote_messages .action_bar .input_wrapper .button_wrapper input').formvote_buttons();
				$('.formvote_messages .action_bar .input_wrapper .textarea_wrapper textarea').textinput().blur(function(){ios_fixed_patch();});
				$(document).scrollTop($('#mes_ses_hold').height());
				load_session();
			}
		}
	});
}
function load_messages_page()
{
	$.ajax({
		url:'http://www.formvote.com/mobile/messages_sessions_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone},
		beforeSend:function(){$('#messages_wrapper').html('<div class="feed_loader"></div>');},
		success:function(object)
		{
			if(valid(object))
			{
				var content=layout_messages_sessions(object);
				$('#messages_wrapper').html(content);
			}
		}
	});
	$.mobile.changePage('#messages_page',default_transition);
}
function load_notifications_page()
{
	$.ajax({
		url:'http://www.formvote.com/mobile/notifications_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone},
		beforeSend:function(){$('#notifications_wrapper').html('<div class="feed_loader"></div>');},
		success:function(object)
		{
			if(valid(object))
			{
				var content=layout_notifications(object);
				$('#notifications_wrapper').html(content);
				$('.notifications_set .block .text .add_buttons input').formvote_buttons();
				load_session();
			}
		}
	});
	$.mobile.changePage('#notifications_page',default_transition);
}

function load_likes_page(post)
{
	$.mobile.changePage("#likes_page",default_transition);
	$.ajax({
		url:'http://www.formvote.com/mobile/likes_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'postid':post},
		beforeSend:function(){$("#likes_wrapper").html('<div class="feed_loader"></div>');},
		success:function(object)
		{
			if(valid(object))
			{
				content=layout_likes(object);
				$('#likes_wrapper').html(content);
			}
		}
	});
}
function load_home_feed(feed)
{
	if($("#home_feed_page").is(".ui-page-active"))
	{
		$(document).scrollTop(0);
	}
	else
	{
		$.mobile.changePage("#home_feed_page",default_transition);
		if(!$('#home_feed_wrapper').html()||feed)
		{
			if(feed=='public'){load_public_feed();}else if(feed=='friends'){load_friends_feed();}
			else
			{
				if(formvote_user.feed_pref=='public'){load_public_feed();}else if(formvote_user.feed_pref=='friends'){load_friends_feed();}
			}
		}
	}
}
var public_feed_last_post;
function load_public_feed()
{
	$('.feed_switcher .tab:nth-child(1)').removeClass('pressed').siblings('.tab:nth-child(2)').addClass('pressed');
	$('.feed_switcher .reload').attr('onclick','load_public_feed();');
	var section='public';
	$.ajax({
		url:'http://www.formvote.com/mobile/show_public_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone},
		beforeSend:function(){
			$('#home_feed_wrapper').html('<div class="feed_loader"></div>');
			$('#home_feed_page .see_more_button').hide();
		},
		success:function(object)
		{
			if(valid(object))
			{
				var content=layout_post(object,section);
				$('#home_feed_wrapper').html(content);
				$('#home_feed_page .see_more_button').attr('onclick','see_more(\'public\');');
				if(object.more){$('#home_feed_page .see_more_button').show();}
			}
		}
	});
}
var friends_feed_last_post;
function load_friends_feed()
{
	$('.feed_switcher .tab:nth-child(2)').removeClass('pressed').siblings('.tab:nth-child(1)').addClass('pressed');
	$('.feed_switcher .reload').attr('onclick','load_friends_feed();');
	var section='friends';
	$.ajax({
		url:'http://www.formvote.com/mobile/show_friends_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone},
		beforeSend:function(){
			$('#home_feed_wrapper').html('<div class="feed_loader"></div>');
			$('#home_feed_page .see_more_button').hide();
		},
		success:function(object)
		{
			if(valid(object))
			{
				if(object.data.length)
				{
					var content=layout_post(object,section);
					$('#home_feed_wrapper').html(content);
					$("#home_feed_page .see_more_button").attr('onclick','see_more(\'friends\');');
					if(object.more){$("#home_feed_page .see_more_button").show();}
				}
				else
				{
					$('#home_feed_wrapper').html('<div class="feed_message_block">You\'re not friends with anyone on Formvote yet.<input class="button" type="button" value="Find Facebook Friends" onclick="fb_connect_general();"></div>');
					$('#home_feed_wrapper .feed_message_block .button').formvote_buttons();
				}
			}
		}
	});
}
var profile_feed_last_post;
function load_profile_feed(profileid)
{
	profile_id=profileid;
	$('#profile_block_wrapper').html('');
	$('#feed_wrapper_profile').html('');
	$.mobile.changePage('#profile_page',default_transition);
	var section='profile';
	$.ajax({
		url:'http://www.formvote.com/mobile/show_profile_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'profileid':profileid},
		beforeSend:function(){
			$('#feed_wrapper_profile').html('<div class="feed_loader"></div>');
			$('#profile_page .see_more_button').hide();
		},
		success:function(object)
		{
			if(valid(object))
			{
				var profile_content=layout_profile(object);
				$('#profile_block_wrapper').html(profile_content);
				$('.profile_block .user_actions .buttons input').formvote_buttons();
				$('.profile_block .user_actions .buttons.single').formvote_buttons();
				$('.profile_block .user_actions .count_block').formvote_buttons();
				if(object.profile.permission===true)
				{
					if(object.data.length)
					{
						var content=layout_post(object,section);
						$('#feed_wrapper_profile').html(content);
					}
					else
					{
						if(profile_id==public){$('#feed_wrapper_profile').html('<div class="feed_message_block">You haven\'t posted yet.</div>');}
						else{$('#feed_wrapper_profile').html('<div class="feed_message_block">This member hasn\'t posted yet.</div>');}
					}
					if(object.more){$('#profile_page .see_more_button').show();}
				}
				else
				{
					$('#feed_wrapper_profile').html('<div class="feed_message_block">This member is private.  Only confirmed friends have access to '+object.profile.uname+'\'s posts.</div>');
				}
			}
		}
	});
}
function layout_post_form(page)
{
	if(page==2){$('.post_page').css('background','#000');}else{$('.post_page').css('background','none');}
	if(page==1)
	{
		audience=(formvote_user.private)?'friends':'public';
		content='<div class="q_text"><textarea placeholder="Create New Post..."></textarea></div>';
		content+='<div class="q_continue_bar"><input type="button" class="audience" value="'+audience+'" onclick="post_change_audience();">';
		content+='<img class="camera_icon" src="images/post_camera.png" onclick="hover_menu({type:\'camera\',camera_target:\'q_image\'});">';
		content+='<img class="add_icon" src="images/post_add.png" onclick="load_post_page(2);">';
		content+='</div>';
		content+='<div class="guide_wrapper"><img class="next_step" src="images/guide_a.png">';
		content+='<img class="audience" src="images/guide_b.png"><img class="add_picture" src="images/guide_c.png"></div>';
		content+='<div class="guide_sys">';
		content+='<div class="guide_message"><span class="step">Step 1: </span><span>Blog</span></div>';
		content+='<div class="guide_dot" onclick="$(\'.guide_wrapper\').toggle();"></div>';
		content+='</div>';
	}
	else if(page==2)
	{
		content='<div class="crossroads">';
		content+='<div class="text" onclick="load_post_page(3);"><img src="images/cross_text.png"></div>';
		content+='<div class="image" onclick="load_post_page(4);"><img src="images/cross_image.png"></div>';
		content+='</div>';
		content+='<div class="guide_wrapper"><img class="choose_options" src="images/guide_f.png"></div>';
		content+='<div class="guide_sys alternate">';
		content+='<div class="guide_message"><span class="step">Step 2: </span><span>Select Style</span></div>';
		content+='<div class="guide_dot" onclick="$(\'.guide_wrapper\').toggle();"></div>';
		content+='</div>';
	}
	else if(page==3 || page==4)
	{
		content='<div class="fixed_question">';
		if(formvote_post.q_uri){content+='<div class="image_block" onclick="hover_menu({type:\'camera\',camera_target:\'q_image\'});"></div>';}
		content+='<div class="text_block" onclick="post_change_question();"></div>';
		content+='</div>';
		if(page==3)
		{
			content+='<form data-ajax="false" onsubmit="submit_post();return false;">';
			content+='<div class="options_wrapper_text">';
			content+='<div class="input_wrap"><div class="remove"><img src="images/option_remove.png"></div><input type="text"></div>';
			content+='<div class="input_wrap"><div class="remove"><img src="images/option_remove.png"></div><input type="text"></div>';
			content+='<img class="add_icon" src="images/post_add.png" onclick="post_add_option(\'text\');">';
			content+='</div>';
			content+='<div class="guide_wrapper"><img class="add_option" src="images/guide_d.png"></div>';
			content+='<input type="submit" class="post_button" value="Publish">';
			content+='</form>';
			content+='<div class="guide_sys w_post">';
			content+='<div class="guide_message"><span class="step">Step 3: </span><span>Add Options</span></div>';
			content+='<div class="guide_dot" onclick="$(\'.guide_wrapper\').toggle();"></div>';
			content+='</div>';
		}
		else if(page==4)
		{
			content+='<form data-ajax="false" onsubmit="submit_post();return false;">';
			content+='<div class="guide_wrapper"><img class="add_option_picture" src="images/guide_c.png"></div>';
			content+='<div class="options_wrapper_image">';
			content+='<div class="set">';
			content+='<div class="image_block"></div>';
			content+='<div class="input_wrap"><div class="remove"><img src="images/option_remove.png"></div><input type="text"></div>';
			content+='</div>';
			content+='<div class="set">';
			content+='<div class="image_block"></div>';
			content+='<div class="input_wrap"><div class="remove"><img src="images/option_remove.png"></div><input type="text"></div>';
			content+='</div>';
			content+='<img class="add_icon" src="images/post_add.png" onclick="post_add_option(\'image\');">';
			content+='</div>';
			content+='<div class="guide_wrapper"><img class="add_option" src="images/guide_d.png"></div>';
			content+='<input type="submit" class="post_button" value="Publish">';
			content+='</form>';
			content+='<div class="guide_sys w_post">';
			content+='<div class="guide_message"><span class="step">Step 3: </span><span>Add Options</span></div>';
			content+='<div class="guide_dot" onclick="$(\'.guide_wrapper\').toggle();"></div>';
			content+='</div>';
		}
	}
	return content;
}
function load_post_page(page)
{
	page=(page && formvote_post)?page:1;
	if(page==2)
	{
		if(!$.trim(formvote_post.q_text))
		{
			showMessage('You haven\'t entered any text.');return;
		}
	}
	var content=layout_post_form(page);
	$('#post_wrapper').html(content);
	if(page==1)
	{
		if(formvote_post==false)
		{
			formvote_post={
				'post_id':generate_id(7),
				'private':(formvote_user.private)?true:false,
				'aoptions':new Array()
			};
		}
		else if(formvote_post)
		{
			formvote_post={
				'post_id':generate_id(7),
				'private':(formvote_user.private)?true:false,
				'aoptions':new Array(),
				'q_text':formvote_post.q_text
			};
			$('.post_page .q_text textarea').val(formvote_post.q_text);
		}
		if(formvote_post.private==true){load_friends_feed();}else{load_public_feed();}
		$('.post_page .q_text textarea').textinput().change(function(){
			formvote_post.q_text=$(this).val();
		}).blur(function(){ios_fixed_patch();});
		$('.nav_button_icon').attr('onclick','history.back();formvote_post=false');
	}
	else if(page==2)
	{
		formvote_post.aoptions=new Array();
		$('.nav_button_icon').attr('onclick','load_post_page(1)');
	}
	else if(page==3 || page==4)
	{
		$('.nav_button_icon').attr('onclick','load_post_page(2)');
		$('.post_page .fixed_question .text_block').text(formvote_post.q_text);
		attach_image('q_image');
		$('.post_page input').textinput();
		$('.post_page .post_button').formvote_buttons();
		if(page==3)
		{
			formvote_post.aimages=false;
			formvote_post.aoptions.push({'a_text':null});
			formvote_post.aoptions.push({'a_text':null});
			post_refresh_options('text');
		}
		else if(page==4)
		{
			formvote_post.aimages=true;
			formvote_post.aoptions.push({'a_field':null,'a_text':null,'a_image':null,'a_uri':null});
			formvote_post.aoptions.push({'a_field':null,'a_text':null,'a_image':null,'a_uri':null});
			post_refresh_options('image');
		}
	}
}
function attach_image(target)
{
	if(target=='q_image')
	{
		if(formvote_post.q_uri)
		{
			$('.post_page .q_continue_bar .camera_icon').attr('src','images/post_camera_b.png');
			$('.post_page .fixed_question .image_block').css({'background-image':'url('+formvote_post.q_uri+')','background-size':'cover','background-color':'#484545'});
		}
	}
	else if(target.substr(0,7)=='a_image')
	{
		var i=target.substr(-1,1);
		if(formvote_post.aoptions[i].a_uri)
		{
			$('.post_page .options_wrapper_image .set:eq('+i+') .image_block').css({'background-image':'url('+formvote_post.aoptions[i].a_uri+')','background-size':'cover','background-color':'#484545'});
		}
	}
}

var search_timeout;
function load_search_page()
{
	$('.search_bar_wrapper .search_bar').val('');
	$('.search_bar_wrapper .clear_icon').hide();
	$('.search_bar_wrapper .search_bar').focus(function(){
		$(".search_bar_wrapper .clear_icon").show();
	});
	$('.search_bar_wrapper .search_bar').keypress(function(){
		clearTimeout(search_timeout);
		search_timeout=setTimeout('search_server();',550);
	});
	$.ajax({
		url:'http://www.formvote.com/mobile/top_posts_api_v2.php',
		type:'POST',
		dataType:'json',
		beforeSend:function(){$('#search_results_wrapper').html('<div class="feed_loader"></div>');},
		data:{'pid':public,'phid':phone},
		success:function(object)
		{
			if(valid(object))
			{
				var content=layout_post(object);
				$('#search_results_wrapper').removeClass('block_wrapper').addClass('feed_wrapper').html(content);
			}
		}
	});
	$.mobile.changePage('#search_page',default_transition);
}
function clear_search()
{
	$(".search_bar_wrapper .search_bar").val('');
	$(".search_bar_wrapper .clear_icon").hide();
	$(".search_bar_wrapper .search_bar").blur();
	$.ajax({
		url:'http://www.formvote.com/mobile/top_posts_api_v2.php',
		type:'POST',
		dataType:'json',
		beforeSend:function(){$('#search_results_wrapper').html('<div class="feed_loader"></div>');},
		data:{'pid':public,'phid':phone},
		success:function(object)
		{
			if(valid(object))
			{
				var content=layout_post(object);
				$('#search_results_wrapper').removeClass('block_wrapper').addClass('feed_wrapper').html(content);
			}
		}
	});
}
function search_server()
{
	var search_value=$(".search_bar_wrapper .search_bar").val();
	$.ajax({
		url:'http://www.formvote.com/mobile/search_api_v2.php',
		type:'POST',
		dataType:'json',
		beforeSend:function(){$("#search_results_wrapper").html('<div class="feed_loader search"></div>');},
		data:{'pid':public,'phid':phone,'search_value':search_value},
		success:function(object)
		{
			if(valid(object))
			{
				var content=layout_search_results(object);
				$('#search_results_wrapper').removeClass('feed_wrapper').addClass('block_wrapper').html(content);
			}
		}
	});
}
function hover_menu(object)
{
	var content='';
	if(object=='close'){$('.screen_filler').remove();$('.hover_menu').hide();return;}
	if(object.type=='post')
	{
		if(!object.owner){
		content+='<div class="button" onclick="postFunction(\'hide\',\''+object.pid+'\');">Hide Post</div>';
		content+='<div class="button" onclick="postFunction(\'report\',\''+object.pid+'\');">Report Post</div>';
		}else{content+='<div class="button" onclick="postFunction(\'delete\',\''+object.pid+'\');">Delete Post</div>';}
	}
	else if(object.type=='account')
	{
		content+='<div class="button blue" onclick="load_settings_page();">Settings</div>';
		content+='<div class="button" onclick="logout();">Log Out</div>';
	}
	else if(object.type=='user')
	{
		if(object.puid==public){content+='<div class="button" onclick="load_settings_page();">Settings</div>';}else{
		content+='<div class="button blue" onclick="load_mes_ses_page(\''+object.puid+'\');">Message</div>';
		content+='<div class="button" onclick="userFunction(\'block\',\''+object.puid+'\');">Block</div>';
		}
	}
	else if(object.type=='camera')
	{
		formvote_data.camera_target=object.camera_target;
		content+='<div class="button" onclick="capturePhoto();">Take Photo</div>';
		content+='<div class="button" onclick="getPhoto();">Browse Library</div>';
	}
	$('.hover_menu').html(content).show().before('<div class="screen_filler" onclick="hover_menu(\'close\');"></div>').siblings('.screen_filler').show();
	$('.hover_menu .button').formvote_buttons();
}
function login(user,pass)
{
	if(!user ||!pass)
	{
		user=$.trim($('#home_input_username').val());
		pass=$.trim($('#home_input_password').val());
	}
	if(!user||!pass){showMessage('Please enter your login information.');return;}
	$.ajax({
		url:'http://www.formvote.com/mobile/login_api_v2.php',
		type:'POST',
		dataType:'json',
		data:{'user':user,'pass':pass},
		success:function(object)
		{
			if(object.passed)
			{
				window.localStorage.setItem('formvote_user',JSON.stringify(object));
				formvote_user=object;
				public=object.public;
				phone=object.phone;
				load_home_feed();
				load_profile_image();
				$('.home_content .input_set .block input').val('');
			}
			else
			{
				showMessage('The login information you entered is invalid.');
			}
		}
	});
}
function logout()
{
	window.localStorage.removeItem('formvote_user');
	flush_profile_image();
	public=false;phone=false;
	load_intro_page('home');
	$.ajax({
		url:'http://www.formvote.com/mobile/intro_api_v2.php',
		type:'GET',
		dataType:'json',
		beforeSend:function(){$('#intro_feed').html('<div class="feed_loader"></div>');},
		success:function(object)
		{
			var content=layout_intro_post(object);
			$('#intro_feed').html(content);
			$('#register_select_wrapper').html(generate_select('register_bdate',object)).children('select').selectmenu().change(function(){
				$(this).parent('.ui-btn').find('span').css({'color':'#666'});
			});
		}
	});
	$('#home_feed_wrapper').html('');
}
function load_intro_page(page)
{
	switch(page)
	{
		case 'home':$.mobile.changePage('#home',default_transition);break;
		case 'register':$.mobile.changePage('#register_page',default_transition);break;
		case 'login':$.mobile.changePage('#login_page',default_transition);break;
	}
}
function onPhotoDataSuccess(imageURI)
{
	hover_menu('close');
	if(formvote_data.camera_target=="profile_picture")
	{
		$('#st_ldr_picture').show();
		all_info=new FileUploadOptions();
		all_info.fileKey="profile_picture";
		all_info.fileName="image.jpg";
		all_info.mimeType="image/jpeg";
		all_info.chunkedMode=false;
		post_vars={'pid':public,'phid':phone};
		all_info.params=post_vars;
		ft=new FileTransfer();
		ft.upload(imageURI, encodeURI("http://www.formvote.com/mobile/image_upload_api_v2.php"), function(data)
		{
			$('#st_ldr_picture').hide();
			load_profile_image();
		}, false, all_info);
	}
	else if(formvote_data.camera_target=='q_image')
	{
		formvote_post.q_field=generate_id(5);
		formvote_post.q_uri=imageURI;
		formvote_post.q_image='process';
		attach_image('q_image');
		all_info=new FileUploadOptions();
		all_info.fileKey='post_image';
		all_info.fileName='image.jpg';
		all_info.mimeType='image/jpeg';
		all_info.chunkedMode=false;
		post_vars={'pid':public,'phid':phone,'post_id':formvote_post.post_id,'field':formvote_post.q_field,'type':'question'};
		all_info.params=post_vars;
		ft=new FileTransfer();
		ft.upload(imageURI, encodeURI("http://www.formvote.com/mobile/image_upload_api_v2.php"), function(data)
		{
			if(data.response=='success')
			{
				formvote_post.q_image=true;
			}
			else
			{
				formvote_post.q_image=false;
			}
		}, false, all_info);
	}
	else if(formvote_data.camera_target.substr(0,7)=='a_image')
	{
		var i=formvote_data.camera_target.substr(-1,1);
		formvote_post.aoptions[i].a_field=generate_id(5);
		formvote_post.aoptions[i].a_uri=imageURI;
		formvote_post.aoptions[i].a_image='process';
		attach_image('a_image'+i);
		all_info=new FileUploadOptions();
		all_info.fileKey='post_image';
		all_info.fileName='image.jpg';
		all_info.mimeType='image/jpeg';
		all_info.chunkedMode=false;
		post_vars={'pid':public,'phid':phone,'post_id':formvote_post.post_id,'field':formvote_post.aoptions[i].a_field,'type':'answer'};
		all_info.params=post_vars;
		ft=new FileTransfer();
		ft.upload(imageURI, encodeURI("http://www.formvote.com/mobile/image_upload_api_v2.php"), function(data)
		{
			if(data.response=='success')
			{
				formvote_post.aoptions[i].a_image=true;
			}
			else
			{
				formvote_post.aoptions[i].a_image=false;
			}
		}, false, all_info);
	}
}
function capturePhoto()
{
	navigator.camera.getPicture(onPhotoDataSuccess,false,{ 
	quality:60,
	destinationType:Camera.DestinationType.FILE_URI,
	sourceType:Camera.PictureSourceType.CAMERA,
	encodingType:Camera.EncodingType.JPEG,
	correctOrientation:true,
	saveToPhotoAlbum:true,
	targetHeight:700
	});
}
function getPhoto()
{
	navigator.camera.getPicture(onPhotoDataSuccess,false,{ 
	quality:50,
	destinationType:Camera.DestinationType.FILE_URI,
	sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
	encodingType:Camera.EncodingType.JPEG,
	correctOrientation:true,
	targetHeight:700
	});
}


function refresh_dis(ppid)
{
	$.ajax({
		url:'http://www.formvote.com/mobile/discussion_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'postid':ppid},
		success:function(object)
		{
			if(valid(object))
			{
				if(object.comments_data){$('.formvote_comments .content').show();}else{$('.formvote_comments .content').hide();}
				var content=layout_comments_feed(object);
				$('.formvote_comments .content .session .feed').html(content);
				$('.formvote_comments .content .session .load_more').remove();
				if(object.more){$('.formvote_comments .content .session .feed').before('<div class="load_more" onclick="comments_load_more(\''+ppid+'\')">View Previous Comments</div>');}
			}
		}
	});
}
function refresh_mes(puid)
{
	$.ajax({
		url:'http://www.formvote.com/mobile/messages_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'puid':puid},
		success:function(object)
		{
			if(valid(object))
			{
				if(object.messages_data){$('.formvote_messages .content').show().siblings('.messages_tab').hide();}else{$('.formvote_messages .content').hide().siblings('.messages_tab').show();}
				var content=layout_messages_feed(object);
				$('.formvote_messages .feed').html(content);
				$('.formvote_messages .load_more').remove();
				if(object.more){$('.formvote_messages .feed').before('<div class="load_more" onclick="messages_load_more(\''+puid+'\')">View Previous Messages</div>');}
			}
		}
	});
}
function dis_po(ppid)
{
	var message=$.trim($('.formvote_comments .input_wrapper .textarea_wrapper textarea').val());
	if(!message){showMessage('You haven\'t entered any text.');return;}
	$.ajax({
		url:'http://www.formvote.com/mobile/post_api_v2.php',
		type:'POST',
		dataType:'json',
		data:{'pid':public,'phid':phone,'message':message,'to':ppid,'what':'discuss_post'},
		beforeSend:function(){$('.formvote_comments .input_wrapper .button_wrapper input').attr('disabled','disabled');},
		success:function(object)
		{
			$('.formvote_comments .input_wrapper .button_wrapper input').removeAttr('disabled');
			if(valid(object))
			{
				if(object.success)
				{
					$('.formvote_comments .input_wrapper .textarea_wrapper textarea').val('');
					refresh_dis(ppid);
				}
			}
		}
	});
}
function mes_po(puid)
{
	var message=$.trim($('.formvote_messages .action_bar .input_wrapper .textarea_wrapper textarea').val());
	if(!message){showMessage('You haven\'t entered any text.');return;}
	$.ajax({
		url:'http://www.formvote.com/mobile/post_api_v2.php',
		type:'POST',
		dataType:'json',
		data:{'pid':public,'phid':phone,'message':message,'to':puid,'what':'message_post'},
		beforeSend:function(){$('.formvote_messages .action_bar .input_wrapper .button_wrapper input').attr('disabled','disabled');},
		success:function(object)
		{
			$('.formvote_messages .action_bar .input_wrapper .button_wrapper input').removeAttr('disabled');
			if(valid(object))
			{
				if(object.success)
				{
					$('.formvote_messages .action_bar .input_wrapper .textarea_wrapper textarea').val('');
					refresh_mes(puid);
				}
			}
		}
	});
}

function see_more(feed)
{
	var feed=(feed)?feed:false;
	var seemore_feed=null;
	var section=null;
	var content='';
	if($('#profile_page').is('.ui-page-active')){seemore_feed='profile';}
	else if(feed=='public'){seemore_feed='public';}
	else if(feed=='friends'){seemore_feed='friends';}
	if(seemore_feed=='profile')
	{
		section='profile';
		$.ajax({
			url:'http://www.formvote.com/mobile/load_more_posts_v2.php',
			type:'GET',
			dataType:'json',
			data:{'pid':public,'phid':phone,'type':'pull','feed':seemore_feed,'profileid':profile_id,'last_time':profile_feed_last_post},
			beforeSend:function(){$('.see_more_button').html('Loading...');},
			success:function(object)
			{
				$('.see_more_button').html('See More Posts');
				if(valid(object))
				{
					content=layout_post(object,section);
					$('#feed_wrapper_profile').append(content);
					if(!object.more){$('#profile_page .see_more_button').hide();}
				}
			}
		});
	}
	else if(seemore_feed=="public")
	{
		section="public";
		$.ajax({
			url:'http://www.formvote.com/mobile/load_more_posts_v2.php',
			type:'GET',
			dataType:'json',
			data:{'pid':public,'phid':phone,'type':'pull','feed':seemore_feed,'last_time':public_feed_last_post},
			beforeSend:function(){$('.see_more_button').html('Loading...');},
			success:function(object)
			{
				$('.see_more_button').html('See More Posts');
				if(valid(object))
				{
					content=layout_post(object,section);
					$('#home_feed_wrapper').append(content);
					if(!object.more){$("#home_feed_page .see_more_button").hide();}
				}
			}
		});
	}
	else
	{
		section="friends";
		$.ajax({
			url:'http://www.formvote.com/mobile/load_more_posts_v2.php',
			type:'GET',
			dataType:'json',
			data:{'pid':public,'phid':phone,'type':'pull','feed':seemore_feed,'last_time':friends_feed_last_post},
			beforeSend:function(){$('.see_more_button').html('Loading...');},
			success:function(object)
			{
				$('.see_more_button').html('See More Posts');
				if(valid(object))
				{
					content=layout_post(object,section);
					$('#home_feed_wrapper').append(content);
					if(!object.more){$("#home_feed_page .see_more_button").hide();}
				}
			}
		});
	}
}

function update_settings(object,type)
{
	if(object.message)
	{
		showMessage(object.message);
	}
	for(var i=0;i<object.settings_values.length;i++)
	{
		$('#st_'+object.settings_values[i].type).attr('onclick','setting_change(\''+type+'\',\''+object.settings_values[i].type+'\');');
		$('#st_'+object.settings_values[i].type+' .value').html(object.settings_values[i].value);
	}
}
function setting_change(type,id)
{
	if(id!="private")
	{
		$('#st_'+id).removeAttr('onclick');
		$("#st_form_"+type+" .settings_header .save_button").show();
		value=$('#st_'+id+' .value').html();
	}
	if(id=="about")
	{
		$('#st_'+id+' .value').html('<textarea name="'+type+'['+id+']" placeholder="'+value+'"></textarea>');
		$('#st_'+id+' textarea').textinput().focus();
	}
	else if(id=="private")
	{
		var private;
		if($('#st_'+id+' .value input').hasClass('private'))
		{
			$('#st_'+id+' .value input').removeClass('private').addClass('public').val('public');
			private='0';
		}
		else
		{
			$('#st_'+id+' .value input').removeClass('public').addClass('private').val('private');
			private='1';
		}
		formvote_user.private=(private=='1')?true:false;
		$.ajax({
			url:'http://www.formvote.com/mobile/settings_update_api_v2.php',
			type:'POST',
			data:{'pid':public,'phid':phone,'private':private}
		});
	}
	else
	{
		$('#st_'+id+' .value').html('<input name="'+type+'['+id+']" type="text" placeholder="'+value+'">');
		$('#st_'+id+' input').textinput().focus();
	}
}

function settings_save(type)
{
	var form_data=$('#st_form_'+type).serialize();
	$.ajax({
		url:'http://www.formvote.com/mobile/settings_update_api_v2.php',
		type:'POST',
		dataType:'json',
		data:form_data+'&pid='+public+'&phid='+phone,
		success:function(object)
		{
			update_settings(object,type);
			if(type=="info"){$('#st_form_'+type+' .value span').css({'color':'#0191c8'});}
			$(".settings_header .save_button."+type).hide();
		}
	});
}

function messages_load_more(puid)
{
	$.ajax({
		url:'http://www.formvote.com/mobile/messages_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'puid':puid,'last_time':messages_feed_last_post},
		beforeSend:function(){$('.formvote_messages .load_more').html('Loading...');},
		success:function(object)
		{
			if(valid(object))
			{
				var content=layout_messages_feed(object);
				$('.formvote_messages .feed').prepend(content);
				$('.formvote_messages .load_more').remove();
				if(object.more){$('.formvote_messages .feed').before('<div class="load_more" onclick="messages_load_more(\''+puid+'\')">View Previous Messages</div>');}
			}
		}
	});
}
function comments_load_more(ppid)
{
	$.ajax({
		url:'http://www.formvote.com/mobile/discussion_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'postid':ppid,'last_time':discussion_feed_last_post},
		beforeSend:function(){$('.formvote_comments .content .session .load_more').html('Loading...');},
		success:function(object)
		{
			if(valid(object))
			{
				var content=layout_comments_feed(object);
				$('.formvote_comments .content .session .feed').prepend(content);
				$('.formvote_comments .content .session .load_more').remove();
				if(object.more){$('.formvote_comments .content .session .feed').before('<div class="load_more" onclick="comments_load_more(\''+ppid+'\')">View Previous Comments</div>');}
			}
		}
	});
}

function refreshPost(pid)
{
	$.ajax({
		url:'http://www.formvote.com/mobile/refresh_post_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'postid':pid},
		success:function(object)
		{
			$('.post_'+pid+' .drop_down').attr({
				onclick:'hover_menu({type:\'post\',pid:\''+pid+'\',owner:'+object.post_data.owner+'})'
			});
			if(object.post_data.like)
			{
				$('.post_'+pid+' .like_icon').attr({
					src:'./images/like2_ic.png',
					onclick:"postFunction('unlike','"+pid+"')"
				});
			}
			else
			{
				$('.post_'+pid+' .like_icon').attr({
					src:'./images/like_ic.png',
					onclick:"postFunction('like','"+pid+"')"
				});
			}
			if(object.post_data.total_like)
			{
				if($('.post_'+pid+' .info_text.like').length==0)
				{$('.post_'+pid+' .drop_down').before('<div class="info_text like" onclick="load_likes_page(\''+object.post_data.ppid+'\');"><img class="icon" src="images/info_l_icon.png" /><span></span></div>');}
				like_text=(object.post_data.total_like>1)?' Likes':' Like';
				$('.post_'+pid+' .info_text.like span').html(object.post_data.total_like+like_text);
			}
			else
			{
				$('.post_'+pid+' .info_text.like').remove();
			}
			if(object.post_data.total_diss)
			{
				if($('.post_'+pid+' .info_text.discuss').length==0)
				{$('.post_'+pid+' .info_bar').prepend('<div class="info_text discuss" onclick="load_comments_page(\''+object.post_data.ppid+'\');"><img class="icon" src="images/info_d_icon.png" /><span></span></div>');}
				diss_text=(object.post_data.total_diss>1)?' Comments':' Comment';
				$('.post_'+pid+' .info_text.discuss span').html(object.post_data.total_diss+diss_text);
			}
			else
			{
				$('.post_'+pid+' .info_text.discuss').remove();
			}
		}
	});
}
function postFunction(type,pid)
{
	$.ajax({
		url:'http://www.formvote.com/mobile/post_functions_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'type':type,'postid':pid},
		success:function(object)
		{
			hover_menu('close');
			if(valid(object)){if(object.message){showMessage(object.message);}}
			if(type=='follow'||type=='unfollow'||type=='like'||type=='unlike'){refreshPost(pid);}
			if(type=='hide'||type=='report'||type=='delete'){$('.post_'+pid).remove();}
		}
	});
}
function userFunction(type,puid)
{
	$.ajax({
		url:'http://www.formvote.com/mobile/user_functions_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'type':type,'puid':puid},
		success:function(object)
		{
			hover_menu('close');
			if(valid(object)){if(object.message){showMessage(object.message);}}
			if(type=='block'){setTimeout('load_home_feed();',2800);}
			else if(type=='add'||type=='remove')
			{
				if(object.friends==true)
				{
					$('.profile_block .buttons .add').addClass('friends').children('input').val('Friends').attr('onclick','userFunction(\'remove\',\''+puid+'\')');
				}
				else
				{
					var button_text=(object.friends=='requested')?'Requested':'Add Friend';
					$('.profile_block .buttons .add').removeClass('friends').children('input').val(button_text).attr('onclick','userFunction(\'add\',\''+puid+'\')');
				}
			}
			else if(type=='friend_add'||type=='friend_deny')
			{
				$('.add_'+puid).remove();
				load_session();
				if($('#notifications_wrapper .notifications_set:first').children('.block').length==0){
				$('#notifications_wrapper .notifications_set:first').remove();$('#notifications_wrapper .notifications_tab').remove();}
			}
		}
	});
}
function fb_connect_general()
{
	if(!formvote_user.fb)
	{
		childbrowserOptions=(device.platform=="Android")?{showLocationBar:false,showAddress:false,showNavigationBar:false}:{showLocationBar:true,showAddress:false,showNavigationBar:true};
		window.plugins.childBrowser.showWebPage('https://www.facebook.com/dialog/oauth?client_id=450581811628719&redirect_uri=http://www.formvote.com/mobile/fb_land.php&scope=publish_actions&response_type=token',childbrowserOptions);
		window.plugins.childBrowser.onLocationChange=function(url)
		{
			var url=unescape(url);
			if(url.substr(0,55)=='http://www.formvote.com/mobile/fb_land.php#access_token')
			{
				var urlFragment=jQuery.deparam.fragment(url);
				$.ajax({
					url:'http://www.formvote.com/mobile/fb_integrate.php',
					type:'POST',
					dataType:'json',
					data:{'pid':public,'phid':phone,'token':urlFragment.access_token},
					success:function(object)
					{
						if(valid(object))
						{
							if(object.message){showMessage(object.message);}
							if(object.passed)
							{
								formvote_user.fb=true;
								load_fb_friends_page();
							}
						}
					}
				});
			}
			else if(url.substr(0,48)=='http://www.formvote.com/mobile/fb_land.php?close')
			{
				window.plugins.childBrowser.close();
			}
		};
	}
	else
	{
		load_fb_friends_page();
	}
}
function layout_friends(object,type)
{
	var content='';
	if(object.friends_data)
	{
		content+='<div class="submenu_header">'+object.friends_data.length;
		if(type){content+=' '+type;}
		content+=' Friend';
		if(object.friends_data.length!=1){content+='s';}
		content+='</div>';
		content+='<div class="block_wrapper">';
		for(var i=0;i<object.friends_data.length;i++)
		{
			content+='<div class="formvote_user_block" onclick="load_profile_feed(\''+object.friends_data[i].pid+'\');">';
			content+='<img class="profile_image" src="http://www.formvote.com/x/profile_images/'+object.friends_data[i].pid+'/picture.jpg?v='+object.friends_data[i].ucache+'">';
			content+='<div class="text_block">';
			content+='<div>'+object.friends_data[i].name+'</div>';
			content+='<div><span class="blue">'+object.friends_data[i].uname+'</span></div>';
			content+='</div>';
			content+='</div>';
		}
		content+='</div>';
	}
	else
	{
		content+='<div class="submenu_header message">No';
		if(type){content+=' '+type;}
		content+=' Friends Found</div>';
		if(type=='Facebook'){content+='<div class="feed_wrapper"><div class="feed_message_block">Be the first to introduce your friends to interactive blogging!</div></div>';}
		
	}
	return content;
}
function load_fb_friends_page()
{
	$.mobile.changePage("#friends_page",{transition:"none",reverse:false,changeHash:true});
	$.ajax({
		url:'http://www.formvote.com/mobile/fb_friends_api.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone},
		beforeSend:function(){$("#friends_wrapper").html('<div class="feed_loader"></div>');},
		success:function(object)
		{
			if(valid(object))
			{
				content=layout_friends(object,'Facebook');
				$('#friends_wrapper').html(content);
			}
		}
	});
}
function load_friends_page(puid)
{
	$.mobile.changePage("#friends_page",{transition:"none",reverse:false,changeHash:true});
	$.ajax({
		url:'http://www.formvote.com/mobile/friends_api_v2.php',
		type:'GET',
		dataType:'json',
		data:{'pid':public,'phid':phone,'profileuid':puid},
		beforeSend:function(){$("#friends_wrapper").html('<div class="feed_loader"></div>');},
		success:function(object)
		{
			if(valid(object))
			{
				content=layout_friends(object,false);
				$('#friends_wrapper').html(content);
			}
		}
	});
}
function signup()
{
	var empty=false;
	$('#register_form select').each(function(i){if($(this).val()=='none'){empty=true;}});
	$('#register_form input').each(function(i){if(!$.trim($(this).val())){empty=true;}});
	if(empty){showMessage('Please fill in all the fields.');return;}
	var form_data=$('#register_form').serialize();
	$.ajax({
		url:'http://www.formvote.com/mobile/register_api_v2.php',
		type:'POST',
		dataType:'json',
		data:form_data,
		success:function(object)
		{
			if(object.success)
			{
				window.localStorage.setItem('formvote_user',JSON.stringify(object.formvote_user));
				formvote_user=object.formvote_user;
				public=object.formvote_user.public;
				phone=object.formvote_user.phone;
				returning_user();
				$('.home_content .input_set .block input').val('');
			}
			else
			{
				showMessage(object.message);
			}
		}
	});
}
function stat_identify(what,value)
{
	if (what=='gender')
	{
		switch(value)
		{
			case 'm':e='male';break;
			case 'f':e='female';break;
		}
	}
	if (what=='eth')
	{
		switch(value)
		{
			case 'w':e='white';break;
			case 'aa':e='african american';break;
			case 'h':e='hispanic/latino';break;
			case 'na':e='native american';break;
			case 'a':e='asian';break;
		}
	}
	if (what=='kids')
	{
		switch(value)
		{
			case 'y':e='yes';break;
			case 'n':e='no';break;
		}
	}
	if (what=='marital')
	{
		switch(value)
		{
			case 's':e='single';break;
			case 'm':e='married';break;
			case 'd':e='divorced';break;
			case 'w':e='widowed';break;
			case 'i':e='In a relationship';break;
		}
	}
	if (what=='education')
	{
		switch(value)
		{
			case 'm':e='middle school';break;
			case 'h':e='high school';break;
			case 'sh':e='some high school';break;
			case 'c':e='college';break;
			case 'sc':e='some college';break;
			case 't':e='technical school';break;
		}
	}
	if(what=='account')
	{
		switch(value)
		{
			case '1':e='Private';break;
			case '0':e='Public';break;
		}
	}
	return e;
}
function generate_id(amount)
{
	function assign_rand_value(num)
	{
		switch(num)
		{
			case 1:rand_value="a";break;
			case 2:rand_value="b";break;
			case 3:rand_value="c";break;
			case 4:rand_value="d";break;
			case 5:rand_value="e";break;
			case 6:rand_value="f";break;
			case 7:rand_value="g";break;
			case 8:rand_value="h";break;
			case 9:rand_value="i";break;
			case 10:rand_value="j";break;
			case 11:rand_value="k";break;
			case 12:rand_value="l";break;
			case 13:rand_value="m";break;
			case 14:rand_value="n";break;
			case 15:rand_value="o";break;
			case 16:rand_value="p";break;
			case 17:rand_value="q";break;
			case 18:rand_value="r";break;
			case 19:rand_value="s";break;
			case 20:rand_value="t";break;
			case 21:rand_value="u";break;
			case 22:rand_value="v";break;
			case 23:rand_value="w";break;
			case 24:rand_value="x";break;
			case 25:rand_value="y";break;
			case 26:rand_value="z";break;
			case 27:rand_value="0";break;
			case 28:rand_value="1";break;
			case 29:rand_value="2";break;
			case 30:rand_value="3";break;
			case 31:rand_value="4";break;
			case 32:rand_value="5";break;
			case 33:rand_value="6";break;
			case 34:rand_value="7";break;
			case 35:rand_value="8";break;
			case 36:rand_value="9";break;
		}
		return rand_value;
	}
	if(amount>0)
	{
		var gen_id='';
		for(var i=1;i<=amount;i++)
		{
			gen_id+=assign_rand_value(Math.floor((Math.random()*36)+1)); 
		}
		return gen_id;
	}
}

function post_change_audience()
{
	if($('.post_page .audience').hasClass('alternate'))
	{
		text=(formvote_user.private)?'friends':'public';
		$('.post_page .audience').removeClass('alternate').val(text);
		formvote_post.private=formvote_user.private;
	}
	else
	{
		text=(formvote_user.private)?'public':'friends';
		$('.post_page .audience').addClass('alternate').val(text);
		formvote_post.private=(formvote_user.private)?false:true;
	}
	if(formvote_post.private==true)
	{
		load_friends_feed();
	}
	else
	{
		load_public_feed();
	}
}
function post_change_question()
{
	var text=$('.post_page .fixed_question .text_block').html();
	$('.post_page .fixed_question .text_block').html('<textarea placeholder="Create New Post...">'+text+'</textarea>').removeAttr('onclick');
	$('.post_page .fixed_question .text_block textarea').textinput().change(function(){
		formvote_post.q_text=$(this).val();
	}).focus();
}
function post_refresh_options(type)
{
	if(type=='text')
	{
		$('.post_page .options_wrapper_text .input_wrap').each(function(i)
		{
			$(this).children('.remove').attr('onclick','post_remove_option(\'text\','+i+')');
			$(this).children('input').unbind('change').change(function(){
				formvote_post.aoptions[i].a_text=$(this).val();
			}).attr('placeholder','Add Option');
		});
		total=$('.post_page .options_wrapper_text .input_wrap').length;
		if(total<=1)
		{
			$('.post_page .options_wrapper_text .input_wrap .remove').hide();
			$('.post_page .options_wrapper_text .input_wrap').css('padding-right','10px');
		}
		else
		{
			$('.post_page .options_wrapper_text .input_wrap .remove').show();
			$('.post_page .options_wrapper_text .input_wrap').css('padding-right','29px');
		}
		if(total>=6)
		{$('.post_page .options_wrapper_text .add_icon').hide();}
		else
		{$('.post_page .options_wrapper_text .add_icon').show();}
	}
	else if(type=='image')
	{
		$('.post_page .options_wrapper_image .input_wrap').each(function(i)
		{
			$(this).siblings('.image_block').attr('onclick','hover_menu({type:\'camera\',camera_target:\'a_image'+i+'\'})');
			$(this).children('.remove').attr('onclick','post_remove_option(\'image\','+i+')');
			$(this).children('input').unbind('change').change(function(){
				formvote_post.aoptions[i].a_text=$(this).val();
			}).attr('placeholder','Add Option');
		});
		total=$('.post_page .options_wrapper_image .input_wrap').length;
		if(total<=2)
		{
			$('.post_page .options_wrapper_image .input_wrap .remove').hide();
			$('.post_page .options_wrapper_image .input_wrap').css('padding-right','10px');
		}
		else
		{
			$('.post_page .options_wrapper_image .input_wrap .remove').show();
			$('.post_page .options_wrapper_image .input_wrap').css('padding-right','29px');
		}
		if(total>=6)
		{$('.post_page .options_wrapper_image .add_icon').hide();}
		else
		{$('.post_page .options_wrapper_image .add_icon').show();}
	}
}
function post_add_option(type)
{
	if(type=='text')
	{
		content='<div class="input_wrap"><div class="remove"><img src="images/option_remove.png"></div><input type="text"></div>';
		$('.post_page .options_wrapper_text .add_icon').before(content);
		$('.post_page .options_wrapper_text .input_wrap input').textinput();
		formvote_post.aoptions.push({'a_text':null});
		post_refresh_options('text');
	}
	else if(type=='image')
	{
		content='<div class="set">';
		content+='<div class="image_block"></div>';
		content+='<div class="input_wrap"><div class="remove"><img src="images/option_remove.png"></div><input type="text"></div>';
		content+='</div>';
		$('.post_page .options_wrapper_image .add_icon').before(content);
		$('.post_page .options_wrapper_image .input_wrap input').textinput();
		formvote_post.aoptions.push({'a_field':null,'a_text':null,'a_image':null,'a_uri':null});
		post_refresh_options('image');
	}
}
function post_remove_option(type,i)
{
	if(type=='text')
	{
		$('.post_page .options_wrapper_text .input_wrap:eq('+i+')').remove();
		post_refresh_options('text');
		formvote_post.aoptions.splice(i,1);
	}
	else if(type=='image')
	{
		$('.post_page .options_wrapper_image .input_wrap:eq('+i+')').parent('.set').remove();
		post_refresh_options('image');
		formvote_post.aoptions.splice(i,1);
	}
}
function submit_post()
{
	if(!$.trim(formvote_post.q_text))
	{
		showMessage('You haven\'t entered any text.');return;
	}
	if(formvote_post.aimages==false)
	{
		for(var i=0;i<formvote_post.aoptions.length;i++)
		{
			if(!$.trim(formvote_post.aoptions[i].a_text)||formvote_post.aoptions[i].a_text==null)
			{
				showMessage('You must fill in all the options.');return;
			}
		}
	}
	else
	{
		for(var i=0;i<formvote_post.aoptions.length;i++)
		{
			if(formvote_post.aoptions[i].a_image==null)
			{
				showMessage('You must add pictures to all the options.');return;
			}
		}
	}
	load_home_feed();
	send_post_data();
	return;
}
function send_post_data()
{
	$('.post_loader .text').html('Posting...');
	$('.post_loader').show();
	var images=function(){
		if(formvote_post.q_image && formvote_post.q_image=='process'){return false;}
		for(var i=0;i<formvote_post.aoptions.length;i++)
		{
			if(formvote_post.aoptions[i].a_image && formvote_post.aoptions[i].a_image=='process'){return false;}
		}
		return true;
	}
	if(images())
	{
		$.ajax({
			url:'http://www.formvote.com/mobile/create_post_api_v2.php',
			type:'POST',
			dataType:'json',
			data:{'pid':public,'phid':phone,'formvote_post':formvote_post},
			success:function(object)
			{
				if(object.message){showMessage(object.message);}
				if(object.success)
				{
					$('.post_loader .text').html('Success!');
					setTimeout(function(){$('.post_loader').hide();},2000);
					var content=layout_post(object);
					if(formvote_post.private==true)
					{$('#home_feed_wrapper').prepend(content);}
					else{$('#home_feed_wrapper').prepend(content);}
					formvote_post=false;
				}
			}
		});
	}
	else
	{
		setTimeout('send_post_data()',4000);
	}
}