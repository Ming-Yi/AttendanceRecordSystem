var jsession = "";
var account = "";
var schnoswork = [];
var schnoskey = [];
var deldate =[];

$(document).ready(function() {
	var checkboxdata = [];
	//載入使用者cookie
	loadUser();
	//Load LocalStorage Data
	loadWork();
	//取得計畫的出勤紀錄
	getschnos();
	

	//新增紀錄
	$("#submit").click(function() {
		var no = $(".schnos").val();
		var date = $('#calendar').fullCalendar( 'clientEvents' );
		var strdata = "";
		var str = "";
		var box = $("#save").prop("checked");
		
		//將資料整理成json
		for(var i=0;i<date.length;i++){
			if(date[i].editable != false){
				str+="{\"date\":\""+datefomat(date[i].start.format())+"\",\"work\":\""+date[i].title+"\"},";
			}
		}
		str = str.substring(0,str.length-1);
		if(	str == ""){
			alert("尚未填入日期");
			return false;
		}
		strdata = "{\"jsession\":\""+jsession+"\",\"schno\":\""+no+"\",\"day\":["+str+"]}";

		$.post('php/nchu.php', {"action":"AddRecord","data":strdata}, function(data) {
			if(data['state']=="success"){
				$('#calendar').fullCalendar('removeEvents');
				getschnos();
				alert("新增成功");	
			}
			else{
				alert("基本資料有誤");
			}
		},"json");
	});

	//print click listener and ajax data to New Window
	$("#printbtn").click(function() {
		var dateBeg = $("#dateBeg").val();
		var dateEnd = $("#dateEnd").val();
		if(dateBeg== "" || dateEnd==""){
			alert("請輸入日期!");
			return false;
		}
		dateBeg = datefomat(dateBeg);
		dateEnd = datefomat(dateEnd);
		if(dateBeg > dateEnd){
			alert("輸入格式有誤!");
			return false;
		}
		var no = $(".schnos").val();
		var strdata = "{\"jsession\":\""+jsession+"\",\"schno\":\""+no+"\",\"dateBeg\":\""+dateBeg+"\",\"dateEnd\":\""+dateEnd+"\"}";
		console.log(strdata);

		$.post('php/nchu.php', {"action": 'PrintRecord',"data": strdata}, function(data) {
			var win=window.open("");
			    with(win.document)
			    {
			      open();
			      write(data);
			      close();
			    }
		});
	});

	//addwork click lister
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

	//delwork click lister
	$("#delwork").click(function() {		
		$('#myModal .modal-body').html("");
		if(window.localStorage["work"] != undefined && window.localStorage["work"] != ""){
			checkboxdata=[];
			var work = window.localStorage["work"].split(",");
			for(var i=0; i<work.length;i++){
				checkboxdata.push(work[i]);
				$('#myModal .modal-body').append("<div class='checkbox'><label><input type='checkbox' name='CheckBoxCities' value='"+work[i]+"' />"+work[i]+"</label></div>");
			}
			$('#myModal').modal("show");
		}else{
			alert("沒有資料可以刪除");
		}		
	});

	//刪除紀錄  取得要刪除的資料
	$("#delsubmit").click(function() {
		$('#delrecord .modal-body table').html("");
		var no = $(".schnos").val();
		var schnosSize = Object.keys(schnoswork[no]).length-1;
		var count = 0;
		var str = "";
		for(var index in schnoswork[no]){
			if(count % 2 == 0 && schnosSize == count )
				str += "<tr><td><label class='checkbox-inline'><input type='checkbox' name='CheckBoxRecords' value='"+index+"' />"+schnoswork[no][index]+"</label></td><td></td></tr>";
			else if(count % 2 == 0 )
				str += "<tr><td><label class='checkbox-inline'><input type='checkbox' name='CheckBoxRecords' value='"+index+"' />"+schnoswork[no][index]+"</label></td>";
			else if (count % 2 == 1)
				str += "<td><label class='checkbox-inline'><input type='checkbox' name='CheckBoxRecords' value='"+index+"' />"+schnoswork[no][index]+"</label></td></tr>";
			count = count + 1;			
		}
		$('#delrecord .modal-body table').append(str);
		$('#delrecord').modal("show");
	});

	$(".schnos").change(function(event) {
		$('#calendar').fullCalendar('removeEvents');
		getschnos();
	});

	//delete work's localStorage data
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
 
 	//刪除紀錄 (post)
	$("#btn-del-record").click(function() {
		deldate= [];
		$('input[type=checkbox][name=CheckBoxRecords]').each(function() {
		    if (this.checked){
		    	deldate.push($(this).val());
		    }
		});
		var datastr = "";

		for(var i in deldate){
			datastr += "\""+deldate[i] +"\",";
		}
		datastr = datastr.substring(0,datastr.length-1);
		if(datastr == ""){
			console.log("OK");
			$('#delrecord').modal('hide');
			return false;
		}
		datastr = "{\"jsession\":\""+jsession+"\",\"rid\":["+datastr+"]}"
		
		$.post('php/nchu.php', {"action":"DelRecord","data":datastr}, function(data) {
			$('#delrecord').modal('hide');
			if(data['state']=="success"){
				$('#calendar').fullCalendar('removeEvents');
				getschnos();
				alert("刪除成功");	
			}else{
				alert("刪除失敗");	
			}		
		},"json");

	});

	// initialize Draggable
	InitDraggable();
	
	// initialize the calendar
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
				if(event.editable != false){
					$('#calendar').fullCalendar( 'removeEvents' ,  event._id);
				}
			});
	   	},
	   	eventOverlap: function(stillEvent, movingEvent) {
	        stillEvent.allDay && movingEvent.allDay;
	    }
	});

	//西元轉民國
	function datefomat(date){
		var datestr =  date.split("-");
		var str="";
		for(var i=0;i<datestr.length;i++){
			str+=datestr[i];
		}
		return (str-19110000);
	}

	//民國轉西元
	function datefomatAD(date){
		var datestr =  (parseInt(date)+19110000).toString();
		var year=datestr.substring(0,4);
		var mon=datestr.substring(4,6);
		var day=datestr.substring(6,8);
		var str = year +"-"+ mon +"-"+ day;
		return str;
	}

	// initialize Draggable
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
		if(document.cookie.length>0){
			var theCookies = document.cookie.split(';');
			for(var index in theCookies){
				if(theCookies[index].indexOf("jsession=")!=-1){
					jsession = theCookies[index].substring(10,theCookies[index].length);
				}else if(theCookies[index].indexOf("schnos=")!=-1){
					var schnos = theCookies[index].substring(8,theCookies[index].length).split(",");
					for(var key in schnos){
						schnoskey.push(schnos[key]);
						$(".schnos").append("<option>"+schnos[key]+"</option>");
					}
				}else if (theCookies[index].indexOf("account=")!=-1){
					account = theCookies[index].substring(9,theCookies[index].length);
				}
			}
		}
		else{
			document.location.href="index.html";
		}
	}


	function getschnos(){
		var GetRecordData = "{\"jsession\":\""+jsession+"\",\"user\":\""+account+"\"}";
		var schnosdata = $(".schnos").val();
		$.ajax({
			url: 'php/nchu.php',
			type: 'POST',
			dataType: 'json',
			data: {"action":"GetRecord","data":GetRecordData},
		})
		.done(function(data) {
			for(var key in schnoskey){
				schnoswork[schnoskey[key]] = {};
			}
			for(var i in data){
				schnoswork[data[i]['schno']][data[i]['rid']] = datefomatAD(data[i]['date'])+" ["+data[i]['work']+"]";
				if(schnosdata == data[i]['schno'] ){
					$('#calendar').fullCalendar( 'addEventSource' ,[{
		                    title  : data[i]['work'],
		                    start  : datefomatAD(data[i]['date']),
			    			"editable":false,
		                }
		            ]);
				}
			}
		});
	}
});