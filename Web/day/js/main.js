$(document).ready(function() {
	var checkboxdata = [];

	loadWork();
	loadUser();

	$("#submit").click(function() {
		var user = $("#user").val();
		var pwd = $("#pwd").val();
		var no = $("#no").val();
		var date = $('#calendar').fullCalendar( 'clientEvents' );
		var strdata = "";
		var str = "";
		var box = $("#save").prop("checked");
		if(user=="" || pwd=="" || no==""){
			alert("請寫基本資料");
			return false;
		}
		if(date == ""){
			alert("尚未填入日期");
			return false;
		}

		if(box == true){
			window.localStorage["User"]=user+","+pwd+","+no;
		}
		
		//將資料整理成json
		for(var i=0;i<date.length;i++){
			str+="{\"date\":\""+datefomat(date[i].start.format())+"\",\"work\":\""+date[i].title+"\"},"		
		}
		str = str.substring(0,str.length-1);
		strdata = "{\"user\":\""+user+"\",\"pwd\":\""+pwd+"\",\"schno\":\""+no+"\",\"day\":["+str+"]}";

		$.post('php/update.php', {"data":strdata}, function(data) {
			if(data=="ERROR"){
				alert("基本資料有誤");
			}
			else{
				$('#calendar').fullCalendar( 'removeEvents');
				alert("新增成功");
			}
		},"json");

	});

	$("#addwork").click(function() {
		if($("#workname").val()=="")
			return false;
		$("#external-events span").append("<div class='fc-event'>"+$("#workname").val()+"</div>");
		if(window.localStorage["work"] == undefined || window.localStorage["work"].length == 0 )
			window.localStorage["work"]	= $("#workname").val()
		else
			window.localStorage["work"]	+= ","+$("#workname").val()
		InitDraggable();	
		$("#workname").val("");
	});

	$("#delwork").click(function() {		
		$('.modal-body').html("");
		if(window.localStorage["work"] != undefined && window.localStorage["work"] != ""){
			checkboxdata=[];
			var work = window.localStorage["work"].split(",");
			for(var i=0; i<work.length;i++){
				checkboxdata.push(work[i]);
				$('.modal-body').append("<input type='checkbox' name='CheckBoxCities' value='"+work[i]+"' />"+work[i]+"<br/>");
			}
			$('#myModal').modal("show");
		}else{
			alert("沒有資料可以刪除");
		}		
	});

	$("#btn-del").click(function() {
		$('input[type=checkbox][name=CheckBoxCities]').each(function() 
		{
		    if (this.checked) 
		    {
		        var index = checkboxdata.indexOf($(this).val());
		        if (index > -1) {
				    checkboxdata.splice(index, 1);
				}
		    }
		});
		window.localStorage["work"] = checkboxdata;
		loadWork();
		$('#myModal').modal('hide');
	});

	/* initialize the external events
	-----------------------------------------------------------------*/
	InitDraggable();
	
	/* initialize the calendar
	-----------------------------------------------------------------*/
	$('#calendar').fullCalendar({
	    columnFormat: {
	        month: 'dddd',
	        week: 'dddd M-d',
	        day: 'dddd M-d'
	    },
	    titleFormat: {
	        month: 'YYYY年 MM月',
	    },
		monthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
		dayNames: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		header: {
			left: '',
			center: 'title',
			right: 'prev,next today'
		},
		editable: true,
		droppable: true, 
		businessHours:true,
		//hiddenDays:[0,6],
		eventRender: function(event, element) {
			element.bind('dblclick', function() {
				$('#calendar').fullCalendar( 'removeEvents' ,  event._id);
				});
	   	},
	   	eventOverlap: function(stillEvent, movingEvent) {
	        stillEvent.allDay && movingEvent.allDay;
	    }
	});

	function datefomat(date){
		var datestr =  date.split("-");
		var str="";
		for(var i=0;i<datestr.length;i++){
			str+=datestr[i];
		}
		return (str-19110000);
	}

	function InitDraggable(){
		$('#external-events .fc-event').each(function() {
			$(this).data('event', {
				title: $.trim($(this).text()), 
				stick: true ,
			});

			$(this).draggable({
				zIndex: 999,
				revert: true,      
				revertDuration: 0  
			});
		});
	}

	function loadWork(){
		$("#external-events span").html("");
		if(window.localStorage["work"] != undefined && window.localStorage["work"] != ""){
			var work = window.localStorage["work"].split(",");
			for(var i=0; i<work.length;i++){
				$("#external-events span").append("<div class='fc-event'>"+work[i]+"</div>");
			}
			InitDraggable();
		}
	}

	function loadUser(){
		if(window.localStorage["User"] != undefined && window.localStorage["User"] != ""){
			var Userdata = window.localStorage["User"].split(",");
			$("#user").val(Userdata[0]);
			$("#pwd").val(Userdata[1]);
			$("#no").val(Userdata[2]);
		}
	}
});