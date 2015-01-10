// ID of div that is to contain all of the map
var addToDiv = document.createElement("div");

var masterXML_DOMs = new Object();
var masterEntityContainer = new Object();
var masterEntityCurrent = new Object();
var lastModifiedDate;

var formats = new Object();
formats.room = new Object();
formats.wall = new Object();
formats.filingCabinet = new Object();
formats.furniture = new Object();
formats.printer = new Object();
formats.supportBeam = new Object();

formats.room.format = "room";
formats.room.orientation = true;
formats.room.objectClass = true;
formats.room.x = true;
formats.room.y = true;
formats.room.width = true;
formats.room.height = true;
formats.room.rows = false;
formats.room.columns = false;
formats.room.type = true;
formats.room.wallPlateNums = true;
formats.room.faxWallPlateNums = false;
formats.room.coorStrs = true;
formats.room.infoSets = new Object();
formats.room.infoSets.display = true;
formats.room.infoSets.model = false;
formats.room.infoSets.fullName = true;
formats.room.infoSets.displayName = true;
formats.room.infoSets.phoneNum = true;
formats.room.infoSets.faxNum = false;
formats.room.infoSets.ipAddress = false;
formats.room.infoSets.faxWallPlateSeq = false;
formats.room.infoSets.wallPlateSeq = true;


formats.wall.format = "wall";
formats.wall.orientation = true;
formats.wall.objectClass = true;
formats.wall.x = true;
formats.wall.y = true;
formats.wall.width = false;
formats.wall.height = false;
formats.wall.rows = false;
formats.wall.columns = false;
formats.wall.type = false;
formats.wall.wallPlateNums = false;
formats.wall.faxWallPlateNums = false;
formats.wall.coorStrs = true;
formats.wall.infoSets = false;

formats.filingCabinet.format = "filingCabinet";
formats.filingCabinet.orientation = true;
formats.filingCabinet.objectClass = false;
formats.filingCabinet.x = true;
formats.filingCabinet.y = true;
formats.filingCabinet.width = true;
formats.filingCabinet.height = true;
formats.filingCabinet.rows = true;
formats.filingCabinet.columns = true;
formats.filingCabinet.type = false;
formats.filingCabinet.wallPlateNums = false;
formats.filingCabinet.faxWallPlateNums = false;
formats.filingCabinet.coorStrs = false;
formats.filingCabinet.infoSets = false;

formats.furniture.format = "furniture";
formats.furniture.orientation = true;
formats.furniture.objectClass = false;
formats.furniture.x = true;
formats.furniture.y = true;
formats.furniture.width = false;
formats.furniture.height = false;
formats.furniture.rows = false;
formats.furniture.columns = false;
formats.furniture.type = false;
formats.furniture.wallPlateNums = false;
formats.furniture.faxWallPlateNums = false;
formats.furniture.coorStrs = true;
formats.furniture.infoSets = false;

formats.printer.format = "printer";
formats.printer.orientation = false;
formats.printer.objectClass = false;
formats.printer.x = true;
formats.printer.y = true;
formats.printer.width = false;
formats.printer.height = false;
formats.printer.rows = false;
formats.printer.columns = false;
formats.printer.type = false;
formats.printer.wallPlateNums = true;
formats.printer.faxWallPlateNums = true;
formats.printer.coorStrs = false;
formats.printer.infoSets = new Object();
formats.printer.infoSets.display = true;
formats.printer.infoSets.model = true;
formats.printer.infoSets.fullName = true;
formats.printer.infoSets.displayName = false;
formats.printer.infoSets.phoneNum = false;
formats.printer.infoSets.faxNum = true;
formats.printer.infoSets.ipAddress = true;
formats.printer.infoSets.faxWallPlateSeq = true;
formats.printer.infoSets.wallPlateSeq = true;

formats.supportBeam.format = "supportBeam";
formats.supportBeam.orientation = true;
formats.supportBeam.objectClass = false;
formats.supportBeam.x = true;
formats.supportBeam.y = true;
formats.supportBeam.width = true;
formats.supportBeam.height = true;
formats.supportBeam.rows = false;
formats.supportBeam.columns = false;
formats.supportBeam.type = false;
formats.supportBeam.wallPlateNums = false;
formats.supportBeam.faxWallPlateNums = false;
formats.supportBeam.coorStrs = false;
formats.supportBeam.infoSets = false;

var roomTypes = new Object();
roomTypes["1"] = new Object();
roomTypes["2"] = new Object();
roomTypes["3"] = new Object();
roomTypes["4"] = new Object();

roomTypes["1"].width = true;
roomTypes["1"].height = true;
roomTypes["1"].coorStrs = false;

roomTypes["2"].width = true;
roomTypes["2"].height = true;
roomTypes["2"].coorStrs = false;

roomTypes["3"].width = false;
roomTypes["3"].height = false;
roomTypes["3"].coorStrs = true;

roomTypes["4"].width = false;
roomTypes["4"].height = false;
roomTypes["4"].coorStrs = true;

var draggableEntity = 0;





window.onload = function () {
    document.body.appendChild(addToDiv);
    addToDiv.setAttribute("id", "schematic");
    var roomSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    addToDiv.appendChild(roomSVG);
    roomSVG.setAttribute("preserveAspectRatio","xMinYMin");
    roomSVG.setAttribute("viewBox","0 0 1109 870");
    roomSVG.setAttribute("id", "roomSVG");

    //build splash screen
    var splashG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    roomSVG.appendChild(splashG);
    splashG.setAttribute("id","splashG");
    var splashBG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    splashG.appendChild(splashBG);
    splashBG.setAttribute("id","splashBG");
    splashBG.setAttribute("height","100%");
    splashBG.setAttribute("width","100%");
    var splashText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    splashG.appendChild(splashText);
    splashText.textContent = "One moment while the map is loaded";
    splashText.setAttribute("id","splashText");
    splashText.setAttribute("transform","translate("+(-1*(splashText.getBBox().width/2))+")");
    splashText.setAttribute("x","50%");
    splashText.setAttribute("y","50%");
    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    splashG.appendChild(defs);
    var linearGrad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    defs.appendChild(linearGrad);
    linearGrad.setAttribute("id","loadingGrad");

    var stopFirst = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    linearGrad.appendChild(stopFirst);
    stopFirst.setAttribute("offset","0%");
    stopFirst.setAttribute("stop-color","white");
    stopFirst.setAttribute("stop-opacity","0");
    var stopSecond = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    linearGrad.appendChild(stopSecond);
    stopSecond.setAttribute("offset","50%");
    stopSecond.setAttribute("stop-color","white");
    stopSecond.setAttribute("stop-opacity","1");
    var stopLast = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    linearGrad.appendChild(stopLast);
    stopLast.setAttribute("offset","100%");
    stopLast.setAttribute("stop-color","white");
    stopLast.setAttribute("stop-opacity","0");

    var swipeRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    splashG.appendChild(swipeRect);
    swipeRect.setAttribute("id","swipeRect");
    swipeRect.setAttribute("height","100%");
    swipeRect.setAttribute("width","5em");
    swipeRect.setAttribute("x","0%");
    swipeRect.setAttribute("transform","translate("+(-1*(swipeRect.getBBox().width/2))+")");
    var animX = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animX.setAttribute("attributeName","x");
    animX.setAttribute("attributeType","XML");
    animX.setAttribute("from","0%");
    animX.setAttribute("to","100%");
    animX.setAttribute("begin","0s");
    animX.setAttribute("dur","3s");
    animX.setAttribute("repeatCount","indefinite");
    swipeRect.appendChild(animX);

    document.body.setAttribute("onmousedown", "dragged(event)");
    document.body.setAttribute("onmouseup", "dropped(event)");
    document.body.setAttribute("onmousemove", "moveTracker(event)");



    //handle the rooms next
    //format = "room";
    loadFormat("wall",false);
    loadFormat("filingCabinet",false);
    loadFormat("furniture",false);
    loadFormat("room",true);
    loadFormat("printer",true);
    loadFormat("supportBeam",false);
    //loadFormat("zone",false);

    showLastModified(lastModified);

    // move the U-floorG to the back so it doesn't appear in front of anything
    var uFloorG = roomSVG.removeChild(document.getElementById("U-floorG"));
    roomSVG.insertBefore(uFloorG, roomSVG.getElementsByClassName("floorG")[0]);

    //populate format selector
    populateFormatSelector();
    updateFloorView();
    updateFormatView();

    //add last modified date
    //addLabelText(roomSVG,"Effective<br>"+document.lastModified.split(' ')[0],"1111","800");
    document.getElementById("ffc").checked = true;
    document.getElementById("sfc").checked = false;
    updateFloorView();

    document.getElementById("searchBar").setAttribute("class","fadeThisIn");
    document.getElementById("splashG").setAttribute("class","fadeThisOut");
};


function showLastModified(lastModified){
    uFloorG = document.getElementById("U-floorG");
    var lmText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    uFloorG.appendChild(lmText);
    lmText.setAttribute("id","lmText");
    lmText.textContent = lastModified;
    lmText.setAttribute("transform","translate(980 810)");

}


function dragged(event){ 
    var container = event.target.parentNode;
    if(container.getAttribute("class") !== null && container.getAttribute("class").indexOf("roomChunk") != -1){
        draggableEntity = 1;
        document.getElementById("roomSVG").style.cursor = "move";
        event.preventDefault();
        createTracker(event);
    }
}
function dropped(event){
    document.getElementById("roomSVG").style.cursor = "auto";
    var tracker = document.getElementById("tracker")
    var container = event.target.parentNode;
    draggableEntity = 0;
    while(document.getElementById("trackerLabel")) document.getElementById("trackerLabel").parentNode.removeChild(document.getElementById("trackerLabel"));
    if(tracker){
        var sourceEntityID = tracker.getAttribute("entityID");
        var sourceInfoSetID = tracker.getAttribute("infoSetID");
        if(container.getAttribute("class") !== null && container.getAttribute("class").indexOf("roomChunk") != -1){ //dropped on viable location
            setTimeout(function(){fadeTracker();}, 25);
            //make call to aspx page that swaps them
            var splitTargetID = container.getAttribute("id").split("-");
            var targetEntityID = splitTargetID[0]+"-"+splitTargetID[1];
            var targetInfoSetID = splitTargetID[2];
            if(sourceEntityID != targetEntityID || sourceInfoSetID != targetInfoSetID){
                swap(sourceEntityID,sourceInfoSetID,targetEntityID,targetInfoSetID);
            }
        } else if(event.target.getAttribute("name") == "source" || event.target.getAttribute("name") == "target"){
            setTimeout(function(){fadeTracker();}, 25);
            event.target.setAttribute("value", sourceEntityID);
            var entity = masterEntityContainer["room"][sourceEntityID];
            var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var displayName = alphabet.indexOf(sourceInfoSetID)==-1?entity.objectID:entity.infoSets[alphabet.indexOf(sourceInfoSetID)].displayName;
            event.target.setAttribute("value", displayName);
            event.target.setAttribute("entityID", sourceEntityID);
            event.target.setAttribute("infoSetID", sourceInfoSetID);
        } else{
            resetTracker();
        }
    }
}

function swapEm(){
    var source = document.getElementById("swapperSource");
    var target = document.getElementById("swapperTarget");
    if(source.value == "Drop" || target.value == "Drop"){
        alert("There must be two items selected in order to swap them. Please select two items.");
    } else{
        swap(source.getAttribute("entityID"),source.getAttribute("infoSetID"),target.getAttribute("entityID"),target.getAttribute("infoSetID"));
    }
}

function swap(sourceEntityID,sourceInfoSetID,targetEntityID,targetInfoSetID){
    var params = "format=room&mod=swap&sourceEntityID="+sourceEntityID+"&sourceInfoSetID="+sourceInfoSetID+"&targetEntityID="+targetEntityID+"&targetInfoSetID="+targetInfoSetID;
    var url = "updateXML.aspx";
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            location.reload();
        }
    }
    http.send(params);
}

function moveTracker(event){
    if(draggableEntity){
        var tracker = document.getElementById("tracker");
        tracker.setAttribute("cx",(event.x+window.scrollX));
        tracker.setAttribute("cy",(event.y+window.scrollY));
        var trackerLabel = document.getElementById("trackerLabel");
        trackerLabel.setAttribute("x",(event.x+window.scrollX));
        trackerLabel.setAttribute("y",(event.y+window.scrollY));
    }
}

function resetTracker(){
    while(document.getElementById("trackerLabel")) document.getElementById("trackerLabel").parentNode.removeChild(document.getElementById("trackerLabel"));
    setTimeout(function(){fadeTracker();}, 25);
    var tracker = document.getElementById("tracker");
    var entityID = tracker.getAttribute("entityID");
    var entityG = document.getElementById(entityID);
    var toX = parseFloat(parseFloat(entityG.getBoundingClientRect().left + window.scrollX,10) + (entityG.getBoundingClientRect().width/2),10);
    var toY = parseFloat(parseFloat(entityG.getBoundingClientRect().top + window.scrollY,10) + (entityG.getBoundingClientRect().height/2),10);
    setTimeout(function(){animateTracker(toX,toY);}, 25);
    
}

function fadeTracker(){
    var tracker = document.getElementById("tracker");
    if(window.getComputedStyle(document.getElementById("tracker")).opacity < .01){
        while(document.getElementById("tracker")) document.getElementById("tracker").parentNode.removeChild(document.getElementById("tracker"));
    } else{
        setTimeout(function(){fadeTracker();}, 25);
        tracker.setAttribute("opacity", (window.getComputedStyle(document.getElementById("tracker")).opacity/2));
    }
}

function animateTracker(toX,toY){
    var tracker = document.getElementById("tracker");
    if(tracker){
        var currentX = (tracker.getBoundingClientRect().left + window.scrollX)
        var currentY = (tracker.getBoundingClientRect().top + window.scrollY)
        var diffX = toX-currentX;
        var diffY = toY-currentY;
        if(Math.abs(diffX) > 1 || Math.abs(diffY) > 1){
            setTimeout(function(){animateTracker(toX,toY);}, 25);
            tracker.setAttribute("cx",(currentX+(diffX/2)));
            tracker.setAttribute("cy",(currentY+(diffY/2)));
        } else{
            tracker.setAttribute("cx",toX);
            tracker.setAttribute("cy",toY);
        }
    }
}

function createTracker(event){
    var tempSplit = event.target.parentNode.getAttribute("id").split("-");
    var entityID = tempSplit[0]+"-"+tempSplit[1];
    var currentEntity = getEntity("room",entityID);
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var label = ""
    if(alphabet.indexOf(tempSplit[2]) != -1){
        label = currentEntity.infoSets[alphabet.indexOf(tempSplit[2])].displayName;
    }
    var tracker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    document.getElementById("roomSVG").appendChild(tracker);
    tracker.setAttribute("id","tracker");
    tracker.setAttribute("class","tracker");
    tracker.setAttribute("entityID",entityID);
    tracker.setAttribute("infoSetID",tempSplit[2]);
    tracker.setAttribute("r","25");
    tracker.setAttribute("stroke","none");
    tracker.setAttribute("fill","#0dffba");
    tracker.setAttribute("cx",(event.x+window.scrollX));
    tracker.setAttribute("cy",(event.y+window.scrollY));
    var trackerLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    document.getElementById("roomSVG").appendChild(trackerLabel);
    trackerLabel.setAttribute("id","trackerLabel");
    trackerLabel.setAttribute("class","trackerLabel");
    trackerLabel.textContent = label;
    trackerLabel.setAttribute("x",(event.x+window.scrollX));
    trackerLabel.setAttribute("y",(event.y+window.scrollY));
}

function populateFormatSelector(){
    var select = document.getElementById("formatSelector");
    for(i in formats){
        var option = document.createElement("option");
        option.innerHTML = formats[i].format;
        option.setAttribute("value",formats[i].format)
        select.appendChild(option);
    }
}

function toggleFloorView(caller){
    if(caller.checked == true){
        document.getElementById(caller.value=="6"?"ffc":"sfc").checked = false;
    }
}
function updateFloorView(){
    var checks = document.getElementById("floorChecks").getElementsByTagName("input");
    for(i = 0; i < checks.length; i++){
        if(document.getElementById(checks[i].value+"-floorG") !== null){ document.getElementById(checks[i].value+"-floorG").setAttribute("display", checks[i].checked==true?"":"none");}
    }
}
function updateFormatView(){
    var checks = document.getElementById("formatChecks").getElementsByTagName("input");
    for(i = 0; i < checks.length; i++){
        for(j = 0; j < document.getElementsByClassName(checks[i].value+"Holder").length; j++){
            document.getElementsByClassName(checks[i].value+"Holder")[j].setAttribute("display", checks[i].checked==true?"":"none");
        }
        if(checks[i].value == "room") {
            for(j = 0; j < document.getElementsByClassName("labelHolder").length; j++){
                document.getElementsByClassName("labelHolder")[j].setAttribute("display", checks[i].checked==true?"":"none");
            }
        }
    }
}

function whichFloor(idString, baseClass){
    if(baseClass === null){
        baseClass = "undefined";
    }
    var reg = /(\d*)-/;
    var curFloor = reg.exec(idString);
    if(curFloor !== null && curFloor[1].length !== 0){
        var floorCode = curFloor[1];
    } else{
        var floorCode = "U";
    }
    if(document.getElementById(floorCode+"-floorG") !== null){
        var floorG = document.getElementById(floorCode+"-floorG");
    } else if(document.getElementById(floorCode+"-floorG") === null){
        var floorG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        floorG.setAttribute("id", floorCode+"-floorG");
        floorG.setAttribute("class", "floorG");
        roomSVG.insertBefore(floorG,document.getElementById("splashG"));
    }
    if(document.getElementById(floorCode+"-"+baseClass+"G") !== null){
        var toG = document.getElementById(floorCode+"-"+baseClass+"G");
    } else{
        var toG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        toG.setAttribute("id", floorCode+"-"+baseClass+"G");
        toG.setAttribute("class", "holder "+baseClass+"Holder");
        floorG.appendChild(toG);
    }
    return toG;
}

function loadXMLDoc(dname)
{
    xhttp = (window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
    xhttp.open("GET",dname,false);
    xhttp.send();
    return xhttp.responseXML;
}

function loadFormat(format, labelIt){
    if(!labelIt || format !== "room"){
        labelIt = false;
    }
    var XMLDoc = loadXMLDoc(format+"s.xml");
    masterXML_DOMs[format] = XMLDoc.getElementsByTagName(format);
    masterEntityContainer[format] = [];
    var labels = [];
    var currentEntity;
    for(i = 0; i < masterXML_DOMs[format].length; i++){
        var id = masterXML_DOMs[format][i].getAttribute("objectID");
        currentEntity=compileEntity(format,i);
        masterEntityContainer[format][id]=currentEntity;
        var labelTemp = addEntity(masterEntityContainer[format][id]);
    }
    if(format == "room"){
        lastModified = XMLDoc.getElementsByTagName("lastModified")[0].childNodes[0].nodeValue;
    }
}

function transp(event){
    if(event.which == "116"){
        var allPaths = document.getElementsByTagName("path");
        for(p=0;p<allPaths.length;p++){
            if(allPaths[p].getAttribute("class") != null && allPaths[p].getAttribute("class").indexOf(" transparent") == -1){
                allPaths[p].setAttribute("class",allPaths[p].getAttribute("class")+" transparent");
            } else if(allPaths[p].getAttribute("class") == null){
                allPaths[p].setAttribute("class"," transparent");
            } else if(allPaths[p].getAttribute("class") != null && allPaths[p].getAttribute("class").indexOf(" transparent") != 0){
                allPaths[p].setAttribute("class",allPaths[p].getAttribute("class").replace(" transparent",""));
            } else if(allPaths[p].getAttribute("class") != null && allPaths[p].getAttribute("class").indexOf(" transparent") == 0){
                allPaths[p].removeAttribute("class");
            }
        }
        document.getElementById("outline").style.opacity=document.getElementById("outline").style.opacity=='0'?'1':'0';
    }
}

function checkEnter(event){
    if(event.which == "13"){
        search();
    }
}

// searches the page for requested content.
function search() {
    clearSearch();
    var results = document.getElementById("results");
    results.innerHTML="";
    results.removeAttribute("style");
    var option = document.getElementById("searchBar").getElementsByTagName("select")[0].value;
    var query = document.getElementById("searchBar").getElementsByTagName("input")[0].value;
    var potential=[];
    for(room in masterEntityContainer["room"]){
        for(infoSet in masterEntityContainer["room"][room]["infoSets"]){
            var fullName = masterEntityContainer["room"][room]["infoSets"][infoSet]["fullName"].toLowerCase();
            var splitName = fullName.split(" ");
            console.log(splitName)
            if(fullName.indexOf(query.toLowerCase()) != -1){
                potential.push(room+"-"+String.fromCharCode(65 + parseInt(infoSet,10)));
            }
        }
    }
    var currentFloor = document.getElementById("floorSelection").value;
    var hiddenMatches = [];
    for(nameMatch of potential){
        if(nameMatch.charAt(0) != currentFloor) hiddenMatches.push(nameMatch);
    }
    if(potential.length === 0){
        results.style.color="red";
        results.innerHTML="No results found";
    }else{
        results.style.color="black";
        results.innerHTML="Result(s) found: "+potential.length;
        if(hiddenMatches.length > 0 && hiddenMatches.length < potential.length) document.getElementById("hiddenResults").innerHTML = "Result(s) found on the "+(currentFloor=="6"?"5th":"6th")+" floor: "+hiddenMatches.length;
        else if(hiddenMatches.length > 0 && hiddenMatches.length == potential.length){
            document.getElementById("floorSelection").selectedIndex = currentFloor=="6"?"0":"1";
            document.getElementById("floorSelection").onchange();
        }
        lookAtMe(potential, hiddenMatches);
    }
}

//clears search
function clearSearch(){
    while (document.getElementsByClassName("clone")[0] !== undefined) {
        document.getElementsByClassName("clone")[0].parentNode.removeChild(document.getElementsByClassName("clone")[0]);
    }
    while (document.getElementsByClassName("detailsG")[0] !== undefined) {
        document.getElementsByClassName("detailsG")[0].parentNode.removeChild(document.getElementsByClassName("detailsG")[0]);
    }
}

function lookAtMe(potential, hiddenMatches){
    for(sourceID of potential){
        var sourceNode = document.getElementById(sourceID);
        var sourceCenterX = (sourceNode.getBBox().x+(sourceNode.getBBox().width/2));
        var sourceCenterY = (sourceNode.getBBox().y+(sourceNode.getBBox().height/2));
        var scale = 1.5;
        var cloneA = sourceNode.cloneNode(true);
        cloneA.setAttribute("class", cloneA.getAttribute("class")+" clone");
        cloneA.setAttribute("id", cloneA.getAttribute("id")+"-cloneA");
        

        //animation values
        var keySplines = " 0 0.25 0.25 1";
        var dur = "0.75s";
        var beginOffset = "0.15s";

        //animate translate
        var animateTransformTranslate = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
        animateTransformTranslate.setAttribute("attributeName","transform");
        animateTransformTranslate.setAttribute("attributeType","XML");
        animateTransformTranslate.setAttribute("type","translate");
        animateTransformTranslate.setAttribute("values","0 0; "+((1-scale)*sourceCenterX)+" "+((1-scale)*sourceCenterY));
        animateTransformTranslate.setAttribute("from","0 0");
        animateTransformTranslate.setAttribute("to",((1-scale)*sourceCenterX)+" "+((1-scale)*sourceCenterY));
        animateTransformTranslate.setAttribute("begin","0s");
        animateTransformTranslate.setAttribute("dur",dur);
        animateTransformTranslate.setAttribute("calcMode","spline");
        animateTransformTranslate.setAttribute("keySplines",keySplines);
        animateTransformTranslate.setAttribute("repeatCount","indefinite");
        animateTransformTranslate.setAttribute("additive","sum");

        //animate scale
        var animateTransformScale = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
        animateTransformScale.setAttribute("attributeName","transform");
        animateTransformScale.setAttribute("attributeType","XML");
        animateTransformScale.setAttribute("type","scale");
        animateTransformScale.setAttribute("values","1; "+scale);
        animateTransformScale.setAttribute("from","1");
        animateTransformScale.setAttribute("to",scale);
        animateTransformScale.setAttribute("begin","0s");
        animateTransformScale.setAttribute("dur",dur);
        animateTransformScale.setAttribute("calcMode","spline");
        animateTransformScale.setAttribute("keySplines",keySplines);
        animateTransformScale.setAttribute("repeatCount","indefinite");
        animateTransformScale.setAttribute("additive","sum");

        //animate opacity
        var animateOpacity = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        animateOpacity.setAttribute("attributeName","opacity");
        animateOpacity.setAttribute("values","1; 0");
        animateOpacity.setAttribute("from","1");
        animateOpacity.setAttribute("to","0");
        animateOpacity.setAttribute("begin","0s");
        animateOpacity.setAttribute("dur",dur);
        animateOpacity.setAttribute("calcMode","spline");
        animateOpacity.setAttribute("keySplines",keySplines);
        animateOpacity.setAttribute("repeatCount","indefinite");
        animateOpacity.setAttribute("additive","replace");
        
        findChildren(cloneA)[0].appendChild(animateTransformTranslate);
        findChildren(cloneA)[0].appendChild(animateTransformScale);
        findChildren(cloneA)[0].appendChild(animateOpacity);

        var cloneB = cloneA.cloneNode(true);
        cloneB.setAttribute("id", sourceNode.getAttribute("id")+"-cloneB");
        
        for(chillen = 0; chillen < findChildren(findChildren(cloneB)[0]).length; chillen++){
            findChildren(findChildren(cloneB)[0])[chillen].setAttribute("begin", beginOffset);
        }

        sourceNode.appendChild(cloneA);
        sourceNode.appendChild(cloneB);
    }

}

// causes elements in passed array to catch the users attention(animate, change color, pulse, etc)

function createNew(){
    var format = document.getElementById("formatSelector").value;
    var newEntity = new Object();
    newEntity.format = format;
    newEntity.objectID = "";
    newEntity.x = null;
    newEntity.y = null;
    newEntity.orientation = null;
    newEntity.objectClass = null;
    newEntity.coorStrs = null;
    newEntity.faxWallPlateNums = null;
    newEntity.wallPlateNums = null;
    newEntity.height = null;
    newEntity.width = null;
    newEntity.columns = null;
    newEntity.rows = null;
    newEntity.type = null;
    newEntity.infoSets = null;
    masterEntityContainer[format][""] = newEntity;
    displayInfo(format,"");
}


function displayInfo(format, id){
    clearSearch();
    var entity = getEntity(format, id);
    masterEntityCurrent = entity;
    //start making info div
    var div = document.createElement("div");
    addToDiv.appendChild(div);
    div.setAttribute("class","roomInfo");
    div.style.left = 0;
    div.style.top = 0;
    var titleDiv = document.createElement("div");
    div.appendChild(titleDiv);
    titleDiv.setAttribute("class", "title");
    var p = document.createElement("p");
    titleDiv.appendChild(p);
    p.innerHTML = id + " - " + entity.format.substr(0,1).toUpperCase()+entity.format.substr(1).toLowerCase();
    contentDiv = document.createElement("div");
    div.appendChild(contentDiv);
    contentDiv.setAttribute("class","content");
    var ul = document.createElement("ul");
    contentDiv.appendChild(ul);
    ul.setAttribute("class", "tabs");
    //var br = document.createElement("br");
    //contentDiv.appendChild(br);
    var li = document.createElement("li");
    ul.appendChild(li);
    li.setAttribute("class","active");
    li.setAttribute("id",entity.objectID+"-Main-li");
    li.addEventListener('click', function(){switchTab(entity.objectID+"-Main-li")}, false);
    var p = document.createElement("p");
    p.innerHTML = entity.objectID+" Main";
    li.appendChild(p);
    var formDiv = document.createElement("div");
    contentDiv.appendChild(formDiv);
    formDiv.setAttribute("class","formDiv");
    formDiv.setAttribute("id",entity.objectID+"formDiv");
    var form = document.createElement("form");
    formDiv.appendChild(form);
    form.setAttribute("id",entity.objectID+"-form");
    form.setAttribute("action","updateXML.aspx");
    form.setAttribute("method","post");
    var updateCallMod = document.createElement("input");//must know whetehr to update, add, or delete
    form.appendChild(updateCallMod);
    updateCallMod.setAttribute("name","mod");
    updateCallMod.setAttribute("type","hidden");
    updateCallMod.setAttribute("value",id===""?"add":"update");
    var oldID = document.createElement("input");
    form.appendChild(oldID);
    oldID.setAttribute("name","oldObjectID");//must be preserved
    oldID.setAttribute("type","hidden");
    oldID.setAttribute("value",entity.objectID);
    var formatInput = document.createElement("input");
    form.appendChild(formatInput);
    formatInput.setAttribute("name","format");//must be preserved
    formatInput.setAttribute("type","hidden");
    formatInput.setAttribute("value",entity.format);
    var formMainDiv = document.createElement("div");
    form.appendChild(formMainDiv);
    formMainDiv.setAttribute("id",entity.objectID+"-Main-div");
    formMainDiv.setAttribute("class","formDiv");
    var formMainGrowDiv = document.createElement("div");
    formMainDiv.appendChild(formMainGrowDiv);
    formMainGrowDiv.setAttribute("class","grow");

    /*var formatNames = [];
    var formatNamesCase = [];
    for(i in formats){
        formatNames.push(formats[i].format);
        formatNamesCase.push(formats[i].format.charAt(0).toUpperCase() + formats[i].format.substr(1));

    }
    var select = addFormElementToContainer(formMainGrowDiv, "format", "Format: ", "format", formatNames, "select", "This is the chosen format of the entity you are edting. You can make it a 'Room', 'Wall', 'Filing Cabinet', 'Furniture', 'Printer', or 'Support Beam'. Each has their own capabilites, and shows up on the map differently. However, each entity will always have a 'Format', 'ID', 'X', and 'Y'.\n\nThe 'ID' is the unique identifier for that entity, and is used by the engine to determine which entity you are referring to. As a result, it must be unique. If it isn't, it can cause many issues.\n\n'X' and 'Y' are the literal location on the map of where the entity should show up. Each entity is positioned from the top-left corner a certain number of units, and this is how you control where they land.\n\nYou can hover over each format name in the drop-down menu to see how each one differs.", formatNamesCase, entity.format, false, ["'Room' is most likely what you are going to be using. It is used to designate a room on the map. Each Room can have a label(or not), and if, you choose to 'display' it, it will be clickable on the real version of the map, and people can see information about it. If it is a room for a person, you can also allow a photo to be displayed of that person if you have on to use.","'Wall' is exactly what it sounds like. A wall is jsut used to create a line, or series of lines, on the map. There is nothing interactive about them.","'Filing Cabinet' is the same as 'Wall', except for how they are made, and what they look like. They are still just lines, but they are much thinner lines.","'Furniture' works the exact same way as 'Wall' except they appear on the map thinner, just like 'FilingCabinet'.","'Printer' is just that. These simply show where a printer is on the map, and can display information about the printer, similar to 'Room'.","'SupportBeam' shows up simply as a black rectangle. Nothing interactive about them, just like 'Wall'."]);
    select.getElementsByTagName("select")[0].addEventListener('change', function(){
        updateFormFormat(this.value);
    }, false);*/ //was meant to update form when a new format was selected. can be used later for creating a new entity

    //create the id inputs
    var idDiv = document.createElement("div");
    formMainGrowDiv.appendChild(idDiv);
    idDiv.setAttribute("class","inputDiv objectID-input");
    idDiv.setAttribute("id","objectID");
    var label = document.createElement("p");
    idDiv.appendChild(label);
    label.setAttribute("class","inputLbl formIdLabel");
    label.innerHTML = "ID: "
    var floorIdSelector = document.createElement("select");
    idDiv.appendChild(floorIdSelector);
    floorIdSelector.setAttribute("name","floorPrefix");
    floorIdSelector.setAttribute("id","floorIdSelector");
    var uFloor = document.createElement("option");
    floorIdSelector.appendChild(uFloor);
    uFloor.setAttribute("value","U");
    uFloor.setAttribute("label","U");
    uFloor.innerHTML = "U";
    var fifthFloor = document.createElement("option");
    floorIdSelector.appendChild(fifthFloor);
    if(entity.objectID.substr(0,1) == "5"){ fifthFloor.setAttribute("selected","selected"); }
    fifthFloor.setAttribute("value","5");
    fifthFloor.setAttribute("label","5");
    fifthFloor.innerHTML = "5";
    var sixthFloor = document.createElement("option");
    if(entity.objectID.substr(0,1) == "6"){ sixthFloor.setAttribute("selected","selected"); }
    sixthFloor.setAttribute("value","6");
    sixthFloor.setAttribute("label","6");
    sixthFloor.innerHTML = "6";
    floorIdSelector.appendChild(sixthFloor);
    var dash = document.createElement("p");
    idDiv.appendChild(dash);
    dash.innerHTML = "-"
    var idInput = document.createElement("input");
    idDiv.appendChild(idInput);
    idInput.setAttribute("class","formInput");
    idInput.setAttribute("name","objectID");
    idInput.setAttribute("value",entity.objectID.substr(2));



    //addFormElementToContainer(document.getElementById("objectID"), "floor", "ID: ", "objectID", entity.objectID, "input",false,true);
    addFormElementToContainer(formMainGrowDiv, "x", "X: ", "x", (entity.x===null?"":entity.x), "input");
    addFormElementToContainer(formMainGrowDiv, "y", "Y: ", "y", (entity.y===null?"":entity.y), "input");
   
     var select = addFormElementToContainer(formMainGrowDiv, "type", "Type: ", "type", ["1","2","3","4"], "select","This refers to the type of room.\n\n'Room L' refers to a normal rectangular room, with the door on the left.\n\n'Room R' is the same, but with the door on the right.\n\n These two room styles have a 'height' and 'width' property that determines their actual size. But the door will always remain on either the left or the right.\n\n'Cubicle' refers to a room that has a custom path chosen for it(which you can specify below), and appears on teh map with a custom style, denoted by the '.cubicle' specifier in the CSS. But this usually shows up as a dotted line.\n\n'Custom Room' is just the same as 'Cubicle' but has the style of a normal room.", ["Room L","Room R","Cubicle","Custom Room"], entity.type);
    select.getElementsByTagName("select")[0].addEventListener('change', function(){
        updateFormType(this.value);
    }, false);
    addFormElementToContainer(formMainGrowDiv, "objectClass", "Class: ", "objectClass", (entity.objectClass===null?"":entity.objectClass), "input");
    addFormElementToContainer(formMainGrowDiv, "orientation", "Orientation: ", "orientation", (entity.orientation===null?"":entity.orientation), "input");
    addFormElementToContainer(formMainGrowDiv, "width", "Width: ", "width", (entity.width===null?"":entity.width), "input");
    document.getElementById("width").getElementsByTagName("input")[0].setAttribute("placeholder","e.g. 48");
    addFormElementToContainer(formMainGrowDiv, "height", "Height: ", "height", (entity.height===null?"":entity.height), "input");
    document.getElementById("height").getElementsByTagName("input")[0].setAttribute("placeholder","e.g. 72");
    addFormElementToContainer(formMainGrowDiv, "rows", "Rows: ", "rows", (entity.rows===null?"":entity.rows), "input");
    addFormElementToContainer(formMainGrowDiv, "columns", "Columns: ", "columns", (entity.columns===null?"":entity.columns), "input");
    addFormElementToContainer(formMainGrowDiv, "coorStrs", "Outline Path: ", "coorStrs", (entity.coorStrs===null?"":entity.coorStrs), "multi","tester");
    addFormElementToContainer(formMainGrowDiv, "wallPlateNums", "Wall Plate: ", "wallPlateNums", (entity.wallPlateNums===null?"":entity.wallPlateNums), "multi",false,true);
    addFormElementToContainer(formMainGrowDiv, "faxWallPlateNums", "Fax Wall Plate: ", "faxWallPlateNums", (entity.faxWallPlateNums===null?"":entity.faxWallPlateNums), "multi",false,true);
    if(formats[format]["infoSets"] !== false){
        var li = document.createElement("li");
        ul.appendChild(li);
        li.setAttribute("id","new-li");
        var button = document.createElement("button");
        li.appendChild(button);
        button.setAttribute("onclick","addInfoSet()");
        button.innerHTML = "+";
    
        if(entity.infoSets !== undefined && entity.infoSets !== null && entity.infoSets.length !== 0){
            var wallPlateValues = [];
            if(entity.wallPlateNums !== null){
                for(i=0; i < entity.wallPlateNums.length;i++){
                    wallPlateValues.push(i);
                }
            }
            var faxWallPlateValues = [];
            if(entity.faxWallPlateNums !== null){
                for(i=0; i < entity.faxWallPlateNums.length;i++){
                    faxWallPlateValues.push(i);
                }
            }
            for(i=0;i<entity.infoSets.length;i++){
                addInfoSet(i, wallPlateValues, faxWallPlateValues);

            }
        }
    }
    updateFormFormat(masterEntityCurrent.format);
    
    var applyButton = document.createElement("button");
    form.appendChild(applyButton);
    applyButton.setAttribute("onclick","applyChanges()");
    //applyButton.setAttribute("type","button");
    applyButton.innerHTML = "Apply";
    var cancelButton = document.createElement("button");
    form.appendChild(cancelButton);
    cancelButton.setAttribute("type","button");
    cancelButton.setAttribute("onclick","clearSearch()");
    cancelButton.innerHTML = "Cancel";
    updateFormHeight();
    clearWhiteSpaceFromInputs();
}

function applyChanges(){
    var tempEntity = createEntityFromForm(masterEntityCurrent.objectID+"-form");
}

function createEntityFromForm(formID){
    var form = document.getElementById(masterEntityCurrent.objectID+"-form");
    var tempEntity = new Object();
    for(var attr in formats[masterEntityCurrent.format]){
        var value = formats[masterEntityCurrent.format][attr];
    }
}

function clearWhiteSpaceFromInputs(){
    var inputs = document.getElementsByTagName("input");
    for(j=0;j<inputs.length;j++){
        if(inputs[j].hasAttribute("value")){
            inputs[j].setAttribute("value",inputs[j].getAttribute("value").trim());
        }
    }
}

function switchTab(idofTab){
    var tabs = findChildren(document.getElementsByClassName("tabs")[0]);
    for(i=0;i<tabs.length;i++){
        tabs[i].setAttribute("class","inactive");
    }
    document.getElementById(idofTab).setAttribute("class","active");
    updateFormHeight();
}

function addFormElementToContainer(container, id, label, name, value, type, tooltip, optionLabelsOrLinkedOrUnique, defValue, notRequired, titles){
    if(type == "multi"){
        var div = document.createElement("div");
        container.appendChild(div);
        div.setAttribute("class","inputDiv multiDivInput "+name+"-input");
        div.setAttribute("id",id);
        if(value.length==0){
            value=[""];
        }
        var selectIdentifier;
        if(name == "wallPlateNums"){
            selectIdentifier = "wallPlateSeq";
        } else if(name == "faxWallPlateNums"){
            selectIdentifier = "faxWallPlateSeq";
        }
        if(optionLabelsOrLinkedOrUnique){
            div.addEventListener('change',function(){ updateDrop(div,selectIdentifier)});
        }
        for(n = 0; n < value.length;n++){
            var slice = document.createElement("div");
            div.appendChild(slice);
            slice.setAttribute("id",id+"-"+n);
            var sliceLabel = document.createElement("p");
            slice.appendChild(sliceLabel);
            sliceLabel.setAttribute("class","inputLbl");
            sliceLabel.innerHTML = label;
            var sliceInput = document.createElement("input");
            slice.appendChild(sliceInput);
            
            sliceInput.setAttribute("class","formInput");
            sliceInput.setAttribute("name",name+"-"+n);
            sliceInput.setAttribute("value",value);
            var buttonDiv = document.createElement("div");
            slice.appendChild(buttonDiv);
            buttonDiv.setAttribute("class","buttonDiv");
            var button = document.createElement("button");
            buttonDiv.appendChild(button);
            button.setAttribute("type","button");
            button.setAttribute("onclick","removeOneInput('"+name+"')");
            button.setAttribute("class","removeButton");
            button.innerHTML = "-";
            var button = document.createElement("button");
            buttonDiv.appendChild(button)
            button.setAttribute("type","button");
            button.setAttribute("onclick","addOneInput('"+name+"')");
            button.setAttribute("class","addButton");
            button.innerHTML = "+";
        }

    } else if(type == "input"){
        var div = document.createElement("div");
        container.appendChild(div);
        div.setAttribute("class","inputDiv "+name+"-input");
        div.setAttribute("id",id);
        var inputLbl = document.createElement("p");
        div.appendChild(inputLbl);
        inputLbl.setAttribute("class","inputLbl");
        inputLbl.innerHTML = label;
        var input = document.createElement("input");
        div.appendChild(input);
        input.setAttribute("class","formInput");
        input.setAttribute("name",name);
        input.setAttribute("value",value);
        if(optionLabelsOrLinkedOrUnique){
            input.addEventListener('change',function(){ checkUnique(this, name)});
        }
    }else if(type == "select"){
        var div = document.createElement("div");
        container.appendChild(div);
        div.setAttribute("class","inputDiv "+name+"-input");
        div.setAttribute("id",id);
        var inputLbl = document.createElement("p");
        div.appendChild(inputLbl);
        inputLbl.setAttribute("class","inputLbl");
        inputLbl.innerHTML = label;
        var select = document.createElement("select");
        div.appendChild(select);
        select.setAttribute("class","formInput");
        select.setAttribute("name",name);
        if(notRequired == true){
            var option = document.createElement("option");
            select.appendChild(option);
            option.setAttribute("value","none");
            option.setAttribute("label","");
            option.innerHTML = "";
        }

        for(j=0;j<value.length;j++){
            var option = document.createElement("option");
            select.appendChild(option);
            option.setAttribute("value",value[j]);
            option.setAttribute("label",optionLabelsOrLinkedOrUnique[j]);
            option.innerHTML = optionLabelsOrLinkedOrUnique[j];
            if(titles !== undefined && titles !== null){
                option.setAttribute("title",titles[j]);
            }
            if(value[j] == defValue){
                option.setAttribute("selected","selected")
            }
        }
    } else if(type == "checkbox"){
        var div = document.createElement("div");
        container.appendChild(div);
        div.setAttribute("class","inputDiv "+name+"-input");
        div.setAttribute("id",id);
        var inputLbl = document.createElement("p");
        div.appendChild(inputLbl);
        inputLbl.setAttribute("class","inputLbl");
        inputLbl.innerHTML = label;
        var input = document.createElement("input");
        div.appendChild(input);
        input.setAttribute("class","formInput");
        input.setAttribute("type","checkbox");
        input.setAttribute("name",name);
        if(value==true){input.setAttribute("checked", "checked");}
        input.addEventListener("change", function(){ document.getElementById(id+"-hidden").setAttribute("value", this.checked==true?"yes":"no");});
        var input = document.createElement("input");
        div.appendChild(input);
        input.setAttribute("type","hidden");
        input.setAttribute("id",id+"-hidden");
        input.setAttribute("name", name+"-true");
        input.setAttribute("value", value==true?"yes":"no");

    }
    if(tooltip != undefined && tooltip !== null && tooltip !== false){
        var tooltipP = document.createElement("p");
        tooltipP.setAttribute("class","tooltip");
        tooltipP.innerHTML = "What's this?";
        tooltipP.setAttribute("title",tooltip);
        if(div.getAttribute("class").indexOf("multiDivInput") == -1){
            div.appendChild(tooltipP);
        } else {
            for(j=0;j<finChildren(div).length;j++){
                findChildren(div)[j].appendChild(tooltipP.cloneNode(true));
            }
        }
    }
    return div;
}
function addOneInput(name){
    var inputDiv = document.getElementById(name);
    var num = findChildren(inputDiv).length;
    var div = findChildren(inputDiv)[findChildren(inputDiv).length-1].cloneNode(true);
    div.setAttribute("id",name+"-"+num);
    div.getElementsByTagName("input")[0].setAttribute("name",name+"-"+num);
    div.getElementsByTagName("input")[0].removeAttribute("value");
    inputDiv.appendChild(div);
    updateFormHeight();
}

function removeOneInput(name){
    var inputDiv = document.getElementById(name);
    inputDiv.removeChild(findChildren(inputDiv)[findChildren(inputDiv).length-1]);
    updateFormHeight();
}

function addInfoSet(index, wallPlateValues, faxWallPlateValues){

    var form = document.getElementById(masterEntityCurrent.objectID+"-form");
    var ul = document.getElementsByClassName("tabs")[0];
    if(index == undefined || index == null){
        index = findChildren(ul).length-2;
    }
    if(wallPlateValues == undefined || wallPlateValues == null || wallPlateValues.length == 0){
        wallPlateValues = [];
    }
    if(faxWallPlateValues == undefined || faxWallPlateValues == null || faxWallPlateValues.length == 0){
        faxWallPlateValues = [];
    }

    var li = document.createElement("li");
    var buttons = document.getElementById("new-li");
    var li = document.createElement("li");
    ul.insertBefore(li,buttons);
    li.setAttribute("id","infoSet-"+index+"-li");
    var newID = "infoSet-"+index+"-li";
    li.addEventListener('click', function(){switchTab(newID)}, false);
    var p = document.createElement("p");
    li.appendChild(p);
    p.innerHTML = "Info Set "+(index+1);
    var infoSetDiv = document.createElement("div");
    var mainDiv;
    for(var child = 0; child < findChildren(form).length; child++){
        if(findChildren(form)[child].getAttribute("id") && findChildren(form)[child].getAttribute("id").indexOf("-Main-div") != -1){
            mainDiv = findChildren(form)[child];
            break;
        }
    }
    form.insertBefore(infoSetDiv, mainDiv);
    infoSetDiv.setAttribute("id","infoSet-"+index+"-div");
    infoSetDiv.setAttribute("class","formDiv infoSetDiv");
    var infoSetGrowDiv = document.createElement("div");
    infoSetDiv.appendChild(infoSetGrowDiv);
    infoSetGrowDiv.setAttribute("class","grow");
    addFormElementToContainer(infoSetGrowDiv, "display-"+index, "Display: ", "display-"+index, ((masterEntityCurrent.infoSets === null || masterEntityCurrent.infoSets[index] === undefined || masterEntityCurrent.infoSets[index].display!==false)?true:masterEntityCurrent.infoSets[index].display),"checkbox");
    addFormElementToContainer(infoSetGrowDiv, "model-"+index, "Model: ", "model-"+index, ((masterEntityCurrent.infoSets === null || masterEntityCurrent.infoSets[index] === undefined || masterEntityCurrent.infoSets[index].model===null)?"":masterEntityCurrent.infoSets[index].model),"input");
    addFormElementToContainer(infoSetGrowDiv, "fullName-"+index, "Full Name: ", "fullName-"+index, ((masterEntityCurrent.infoSets === null || masterEntityCurrent.infoSets[index] === undefined || masterEntityCurrent.infoSets[index].fullName===null)?"":masterEntityCurrent.infoSets[index].fullName),"input");
    addFormElementToContainer(infoSetGrowDiv, "displayName-"+index, "Display Name: ", "displayName-"+index, ((masterEntityCurrent.infoSets === null || masterEntityCurrent.infoSets[index] === undefined || masterEntityCurrent.infoSets[index].displayName===null)?"":masterEntityCurrent.infoSets[index].displayName),"input");
    addFormElementToContainer(infoSetGrowDiv, "textX-"+index, "Text X: ", "textX-"+index, ((masterEntityCurrent.infoSets === null || masterEntityCurrent.infoSets[index] === undefined || masterEntityCurrent.infoSets[index].textX===null)?"":masterEntityCurrent.infoSets[index].textX),"input");
    addFormElementToContainer(infoSetGrowDiv, "textY-"+index, "Text Y: ", "textY-"+index, ((masterEntityCurrent.infoSets === null || masterEntityCurrent.infoSets[index] === undefined || masterEntityCurrent.infoSets[index].textY===null)?"":masterEntityCurrent.infoSets[index].textY),"input");
    addFormElementToContainer(infoSetGrowDiv, "textWidth-"+index, "Text Width: ", "textWidth-"+index, ((masterEntityCurrent.infoSets === null || masterEntityCurrent.infoSets[index] === undefined || masterEntityCurrent.infoSets[index].textWidth===null)?"":masterEntityCurrent.infoSets[index].textWidth),"input");
    addFormElementToContainer(infoSetGrowDiv, "phoneNum-"+index, "Extension: ", "phoneNum-"+index, ((masterEntityCurrent.infoSets === null || masterEntityCurrent.infoSets[index] === undefined || masterEntityCurrent.infoSets[index].phoneNum===null)?"":masterEntityCurrent.infoSets[index].phoneNum),"input");
    addFormElementToContainer(infoSetGrowDiv, "faxNum-"+index, "Fax Number: ", "faxNum-"+index, ((masterEntityCurrent.infoSets === null || masterEntityCurrent.infoSets[index] === undefined || masterEntityCurrent.infoSets[index].faxNum===null)?"":masterEntityCurrent.infoSets[index].faxNum),"input");
    addFormElementToContainer(infoSetGrowDiv, "ipAddress-"+index, "IP Address: ", "ipAddress-"+index, ((masterEntityCurrent.infoSets === null || masterEntityCurrent.infoSets[index] === undefined || masterEntityCurrent.infoSets[index].ipAddress===null)?"":masterEntityCurrent.infoSets[index].ipAddress),"input");
    addFormElementToContainer(infoSetGrowDiv, "wallPlateSeq-"+index, "Wall Plate: ", "wallPlateSeq-"+index, wallPlateValues, "select","This is the wall plate number that the ethernet chord plugs into. If there is no ethernet chord, just leave this blank.", masterEntityCurrent.wallPlateNums, (masterEntityCurrent.infoSets !== null && masterEntityCurrent.infoSets[index] !== undefined)?masterEntityCurrent.infoSets[index].assignedWallPlate:"",true);
    addFormElementToContainer(infoSetGrowDiv, "faxWallPlateSeq-"+index, "Fax Wall Plate: ", "faxWallPlateSeq-"+index, faxWallPlateValues, "select","This is the wall plate number that the fax line plugs into. If there is no fax line, just leave this blank.", masterEntityCurrent.faxWallPlateNums, (masterEntityCurrent.infoSets !== null && masterEntityCurrent.infoSets[index] !== undefined)?masterEntityCurrent.infoSets[index].assignedFaxWallPlate:"",true);
    updateFormFormat(masterEntityCurrent.format);
    updateFormHeight();
}
function removeInfoSet(){
    var ul = document.getElementsByClassName("tabs")[0];
    if(findChildren(ul)[findChildren(ul).length-2].getAttribute("class") == "active"){
        switchTab(findChildren(ul)[findChildren(ul).length-3].getAttribute("id"));
    }
    var infoSetLis = [];
    for(i=0;i<findChildren(ul).length;i++){
        if(findChildren(ul)[i].getAttribute("id").indexOf("infoSet-") != -1){
            infoSetLis.push(findChildren(ul)[i]);
        }
    }
    ul.removeChild(infoSetLis[infoSetLis.length-1]);
    //updateFormFormat(document.getElementById("format").getElementsByTagName("select")[0].value);
    updateFormHeight();
}

function updateDrop(source, selectIdentifier){
    var inputs = [];
    for(i=0;i<source.getElementsByTagName("input").length;i++){
        if(source.getElementsByTagName("input")[i].value.replace(" ","").length!=0){
            inputs.push(source.getElementsByTagName("input")[i].value);
        }
    }

    var selects = [];
    for(i=0;i<document.getElementsByTagName("select").length;i++){
        var curSelect = document.getElementsByTagName("select")[i];
        if(curSelect.parentNode.getAttribute("id")!==null && curSelect.parentNode.getAttribute("id").indexOf(selectIdentifier) != -1){
            selects.push(document.getElementsByTagName("select")[i]);
        }
    }
    if(selects[0][0].value== "" || selects[0][0].value== "none"){
        inputs.splice(0,0,"none");
    }

    for(i=0;i<selects.length;i++){
        var selectedValue = selects[i].value;
        while(selects[i].firstChild){
            selects[i].removeChild(selects[i].firstChild);
        }
        for(j=0;j<inputs.length;j++){
            var option = document.createElement("option");
            option.setAttribute("value",(inputs[j]=="none"?"none":j));
            option.setAttribute("label",(inputs[j]=="none"?"":inputs[j]));
            option.innerHTML=(inputs[j]=="none"?"":inputs[j]);
            if(option.value == selectedValue){
                option.setAttribute("selected","selected");
            }
            selects[i].appendChild(option);
        }
    }
}

function checkUnique(node,name){
    unique = true;
    for(i in masterEntityContainer){
        for(j in masterEntityContainer[i]){
            if(node.value == masterEntityContainer[i][j][name] && node.value != masterEntityCurrent[name]){
                unique = false
            }
        }
    }
    if(!unique){
        node.setAttribute("class", (node.getAttribute("class")==null?"":node.getAttribute("class")) + " notUnique");
        alert("Warning: This field must be unique. It appears that there is another entity currently using the value '"+node.value+"' for the field '"+name+"'. This field will be reset to it's default state.");
        node.value = node.getAttribute("value");
    }
    node.setAttribute("class", (node.getAttribute("class")==null?"":node.getAttribute("class")).replace(" notUnique",""));
}

function updateFormHeight(){
    var formChildren = findChildren(document.getElementById(masterEntityCurrent.objectID+"-form"));
    for(j=0;j<formChildren.length;j++){
        if(formChildren[j].tagName.toUpperCase() == "DIV"){
            formChildren[j].style.height = "0";
        }
    }
    var currentDiv = document.getElementById(document.getElementsByClassName("tabs")[0].getElementsByClassName("active")[0].getAttribute("id").replace("-li","-div"));
    currentDiv.style.height = findChildren(currentDiv)[0].clientHeight+"px";
}

//updates the form to adjust for various formats
function updateFormFormat(value){
    for(j in formats[value]){
        var node = document.getElementById(j);
        if(node !== null){
            if(formats[value][j] == false){
                node.style.display = "none";
            }else{
                node.removeAttribute("style");
            }
        }
    }
    var inactives = document.getElementsByClassName("tabs")[0].getElementsByClassName("inactive");
    if(formats[value].infoSets !== false){
        var infoSetDivs = document.getElementsByClassName("infoSetDiv");
        for(j = 0;j<infoSetDivs.length;j++){
            infoSetDivs[j].style.height = "0";
            for(k in formats[value].infoSets){
                var node = document.getElementById(k+"-"+j);
                if(node !== null){
                    if(formats[value].infoSets[k] == false){
                        node.style.display = "none";
                    }else{
                        node.removeAttribute("style");
                    }
                }
            }
        }
        
        for(j=0;j<inactives.length;j++){
            inactives[j].removeAttribute("style");
        }
    }
    else{
        for(j=0;j<inactives.length;j++){
            inactives[j].style.display="none";
        }
    }
    if(value == "room"){
        updateFormType(document.getElementById("type").getElementsByTagName("select")[0].value);
    }
    
    updateFormHeight();
}

//updates the form based on the type of the room
function updateFormType(value){

    for(j in roomTypes[value]){
        var node = document.getElementById(j);
        if(node !== null){
            if(roomTypes[value][j] == false){
                node.style.display = "none";
            }else{
                node.removeAttribute("style");
            }
        }
    }
    updateFormHeight();
}

function compileEntity(format, i){
    //masterEntityContainer[format+"Entities"];
    var thisXMLDOM = masterXML_DOMs[format][i];
    var entity = new Object();
    entity.format = format;
    entity.objectID = thisXMLDOM.getAttribute("objectID");
    entity.x = (thisXMLDOM.getAttribute("x") !== undefined && thisXMLDOM.getAttribute("x") !== "")?thisXMLDOM.getAttribute("x"):0;
    entity.y = (thisXMLDOM.getAttribute("y") !== undefined && thisXMLDOM.getAttribute("y") !== "")?thisXMLDOM.getAttribute("y"):0;
    entity.objectClass = (thisXMLDOM.getAttribute("objectClass") !== undefined && thisXMLDOM.getAttribute("objectClass") !== "")?thisXMLDOM.getAttribute("objectClass"):null;
    entity.orientation = (thisXMLDOM.getAttribute("orientation") !== undefined && thisXMLDOM.getAttribute("orientation") !== "")?thisXMLDOM.getAttribute("orientation"):0;
    if(entity.format == "printer"){
        entity.orientation = null
    }
    entity.coorStrs = [];
    coors = thisXMLDOM.getElementsByTagName("coorStr");
    for(j=0;j<coors.length;j++){
        entity.coorStrs.push(coors[j].childNodes[0].nodeValue);
    }
    if(entity.coorStrs.length == 0){
        entity.coorStrs = null;
    }
    entity.width = (thisXMLDOM.getAttribute("width")!==undefined && thisXMLDOM.getAttribute("width")!== "")?thisXMLDOM.getAttribute("width"):null;
    entity.height = (thisXMLDOM.getAttribute("height")!==undefined && thisXMLDOM.getAttribute("height")!== "")?thisXMLDOM.getAttribute("height"):null;
    entity.type = (thisXMLDOM.getAttribute("type")!==undefined && thisXMLDOM.getAttribute("type")!== "")?thisXMLDOM.getAttribute("type"):null;
    entity.rows = null;
    entity.columns = null;
    if(entity.format == "filingCabinet"){
        entity.rows = (thisXMLDOM.getAttribute("rows")!==undefined && thisXMLDOM.getAttribute("rows")!== "")?thisXMLDOM.getAttribute("rows"):1;
        entity.columns = (thisXMLDOM.getAttribute("columns")!==undefined && thisXMLDOM.getAttribute("columns")!== "")?thisXMLDOM.getAttribute("columns"):1;
    }
    entity.infoSets = null;
    entity.wallPlateNums = null;
    entity.faxWallPlateNums = null;
    if(entity.format == "room" || entity.format == "printer"){
        entity.infoSets = [];
        infoSets = thisXMLDOM.getElementsByTagName("infoSet");
        for(j=0;j<infoSets.length;j++){
            infoSet = new Object();
            infoSet.fullName = (infoSets[j].getElementsByTagName("name")[0] !== undefined && infoSets[j].getElementsByTagName("name")[0].childNodes[0] !== undefined)?infoSets[j].getElementsByTagName("name")[0].childNodes[0].nodeValue:null;
            infoSet.displayName = (infoSets[j].getElementsByTagName("name")[0] !== undefined && infoSets[j].getElementsByTagName("name")[0].getAttribute("displayName") !== undefined)?infoSets[j].getElementsByTagName("name")[0].getAttribute("displayName"):null;
            infoSet.display = (infoSets[j].getAttribute("display") !== undefined && infoSets[j].getAttribute("display") !== null && infoSets[j].getAttribute("display") !== "")?false:true;
            infoSet.textX = (infoSets[j].getAttribute("textX") !== undefined && infoSets[j].getAttribute("textX") !== null && infoSets[j].getAttribute("textX") !== "")?infoSets[j].getAttribute("textX"):null;
            infoSet.textY = (infoSets[j].getAttribute("textY") !== undefined && infoSets[j].getAttribute("textY") !== null && infoSets[j].getAttribute("textY") !== "")?infoSets[j].getAttribute("textY"):null;
            infoSet.textWidth = (infoSets[j].getAttribute("textWidth") !== undefined && infoSets[j].getAttribute("textWidth") !== null && infoSets[j].getAttribute("textWidth") !== "")?infoSets[j].getAttribute("textWidth"):null;
            infoSet.assignedFaxWallPlate = (infoSets[j].getAttribute("assignedFaxWallPlate")!==undefined && infoSets[j].getAttribute("assignedFaxWallPlate")!== "")?infoSets[j].getAttribute("assignedFaxWallPlate"):null;
            infoSet.assignedWallPlate = (infoSets[j].getAttribute("assignedWallPlate")!==undefined && infoSets[j].getAttribute("assignedWallPlate")!== "")?infoSets[j].getAttribute("assignedWallPlate"):null;
            infoSet.ipAddress = infoSets[j].getElementsByTagName("ipAddress")[0] !== undefined ? infoSets[j].getElementsByTagName("ipAddress")[0].childNodes[0].nodeValue:null;
            infoSet.phoneNum = infoSets[j].getElementsByTagName("phoneNum")[0] !== undefined ? infoSets[j].getElementsByTagName("phoneNum")[0].childNodes[0].nodeValue:null;
            infoSet.faxNum = infoSets[j].getElementsByTagName("faxNum")[0] !== undefined ? infoSets[j].getElementsByTagName("faxNum")[0].childNodes[0].nodeValue:null;
            infoSet.model = infoSets[j].getElementsByTagName("model")[0] !== undefined ? infoSets[j].getElementsByTagName("model")[0].childNodes[0].nodeValue:null;
            entity.infoSets.push(infoSet);
            delete infoSet;
        }

        entity.wallPlateNums = [];
        wallPlateNums = thisXMLDOM.getElementsByTagName("wallPlateNum");
        for(j=0;j<wallPlateNums.length;j++){
            entity.wallPlateNums.push(wallPlateNums[j].childNodes[0].nodeValue);
        }
        entity.faxWallPlateNums = [];
        faxWallPlateNums = thisXMLDOM.getElementsByTagName("faxWallPlateNum");
        for(j=0;j<faxWallPlateNums.length;j++){
            entity.faxWallPlateNums.push(faxWallPlateNums[j].childNodes[0].nodeValue);
        }
        if(entity.wallPlateNums.length == 0){
            entity.wallPlateNums = null;
        }
        if(entity.faxWallPlateNums.length == 0){
            entity.faxWallPlateNums = null;
        }
    }
    return entity;
}

function getEntity(format, id){
    return masterEntityContainer[format][id];
}






/*


 Divides the room into slices, based on the number of infoSets, i.e. people, that are assigned to the room, so they can be 
 individually interacted with.

 Depending on if the room is tall or wide(not considering rotation of the encapsulating <g>) it will determine which direction
 is best to split the room. If it's tall, it will slice it horizontally, and if wide, vertically. This is to ensure the
 divisions are not too narrow in either dimension.

 //Outline

 The outline of the room is just the normal path used for that room.

 //Chunks & Rects

 Each "chunk", i.e. division, of the room is a normal <rect> that repesents a slice of the room. Depending on which dimension of
 the room is larger, height or width, the <rect> will take up 100% of the other, i.e. smaller, dimension, but only 1/n of the
 other dimension, where n is the number of infoSets assigned to the room. Chunks are also positioned accordingly so together, they
 take up 100% of both dimensions of the room. 

 For example, if the room is wider than it is tall(before being rotated), and there are 3 infoSets assigned to the room, 3 <rect>
 will be created, each 100% the height of the room, but only 1/3 the width, and they will be lined up from left to right to fill
 the entire space of the room.

 //Clipping Path

 The clipping path is used by these <rect> to control where their fill draws. Since rooms are not perfect rectangles, and the 
 rooms "space" is actually its BBox, there will usually be a section of the rect that resides outside of the outline of the room.
 The clipping path makes it so that section simply does not draw. The <rect> aren't invisible, but have no fill, nor stroke as
 their default, but when the mouse hovers over them, their fill changes color, the cursor is changed to 'pointer' and they can
 be clicked. The clipping path both prevents that fill from being seen, while also preventing the mouse's hover pointer-event
 from being detected in spaces outside of the room, i.e. outside the outline of the room(clipping path's path).

 //container

 The container variable this function takes in, is the <g> that contains the rooms elements, short of the label.

 //entity

 The entity variable this function takes in, is the formatted version of all the data that exists which pertains to this room.
 All entity objects are stored in the masterEntityList object generated when this page loaded and pulled the data repositories.

*/
function chunkify(container, entity){
    var roomPath = container.getElementsByTagName("path")[0];
    
    var defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
    container.insertBefore(defs,container.firstChild);

    //Create a clipping path to control where the chunks can be interacted with

    // NOTE: `clipPath` is case-sensative during declaration of a new element, apparently
    var fillClipPath = document.createElementNS("http://www.w3.org/2000/svg","clipPath");
    defs.appendChild(fillClipPath);
    fillClipPath.setAttribute("id",entity.objectID+"-fillClipPath");
    var fillPath = document.createElementNS("http://www.w3.org/2000/svg","path");
    fillClipPath.appendChild(fillPath);
    fillPath.setAttribute("d",roomPath.getAttribute("d"));

    //generate chunks

    for(k=0; k < entity.infoSets.length;k++){
        var g = document.createElementNS("http://www.w3.org/2000/svg","g");
        container.insertBefore(g, roomPath)
        var chr = "-"+String.fromCharCode(65 + k);
        g.setAttribute("id", entity.objectID + chr);
        g.setAttribute("class","roomChunk");
        var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
        g.appendChild(rect);
        bbHeight = parseFloat(roomPath.getBBox().height);
        bbWidth = parseFloat(roomPath.getBBox().width);
        var wide = bbWidth > bbHeight;
        rect.setAttribute("x",(entity.infoSets.length > 1 && wide)?(k*(bbWidth/entity.infoSets.length)):"0");
        rect.setAttribute("y",(entity.infoSets.length > 1 && !wide)?(k*(bbHeight/entity.infoSets.length)):"0");
        rect.setAttribute("width",(entity.infoSets.length > 1 && wide)?(bbWidth/entity.infoSets.length):bbWidth);
        rect.setAttribute("height",(entity.infoSets.length > 1 && !wide)?(bbHeight/entity.infoSets.length):bbHeight);
        rect.setAttribute("clip-path","url(#"+entity.objectID+"-fillClipPath)");
        rect.setAttribute("class","roomChunkBG");
        rect.addEventListener('click', function(){displayInfo(entity.format, entity.objectID)}, false);

        applyLabel(entity, k, wide);
    }




}

function chunkify(container, entity){
    var roomPath = container.getElementsByTagName("path")[0];
    
    var defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
    container.insertBefore(defs,container.firstChild);
    var fillClipPath = document.createElementNS("http://www.w3.org/2000/svg","clipPath");
    defs.appendChild(fillClipPath);
    fillClipPath.setAttribute("id",entity.objectID+"-fillClipPath");
    var fillPath = roomPath.cloneNode(true);
    fillClipPath.appendChild(fillPath);
    fillPath.setAttribute("d",roomPath.getAttribute("d"));

    for(k=0; k < entity.infoSets.length;k++){
        var g = document.createElementNS("http://www.w3.org/2000/svg","g");
        container.insertBefore(g, roomPath)
        var chr = "-"+String.fromCharCode(65 + k);
        g.setAttribute("id", entity.objectID + chr);
        g.setAttribute("class","roomChunk");
        var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
        g.appendChild(rect);
        bbHeight = parseFloat(roomPath.getBBox().height);
        bbWidth = parseFloat(roomPath.getBBox().width);
        var wide = bbWidth > bbHeight;
        rect.setAttribute("x",(entity.infoSets.length > 1 && wide)?(k*(bbWidth/entity.infoSets.length)):"0");
        rect.setAttribute("y",(entity.infoSets.length > 1 && !wide)?(k*(bbHeight/entity.infoSets.length)):"0");
        rect.setAttribute("width",(entity.infoSets.length > 1 && wide)?(bbWidth/entity.infoSets.length):bbWidth);
        rect.setAttribute("height",(entity.infoSets.length > 1 && !wide)?(bbHeight/entity.infoSets.length):bbHeight);
        rect.setAttribute("clip-path","url(#"+entity.objectID+"-fillClipPath)");
        rect.setAttribute("class","roomChunkBG");
        rect.addEventListener('click', function(){displayInfo(event, entity.format)}, false);

        applyLabel(entity, k, wide);
    }
}

function applyLabel(entity, infoSetIndex, wide){
    var textPadding = 2;
    var chunkG = document.getElementById(entity.objectID).getElementsByClassName("roomChunk")[infoSetIndex];
    var chunkWidth = chunkG.getElementsByClassName("roomChunkBG")[0].getAttribute("width");
    var chunkHeight = chunkG.getElementsByClassName("roomChunkBG")[0].getAttribute("height");
    var chunkGCenterX = (chunkWidth/2) + (wide?(chunkWidth*infoSetIndex):0);
    var chunkGCenterY = (chunkHeight/2) + (!wide?(chunkHeight*infoSetIndex):0);

    var theta = entity.orientation;
    var thetaPos = (360+(entity.orientation%360))%360;
    var thetaPosMod = ((360+(entity.orientation%360))%360)%90;
    var thetaRads = thetaPosMod*(Math.PI/180);
    var adjustedWidth = (thetaPosMod == 0)
        ? ((thetaPos%180 == 0)?chunkWidth:chunkHeight)
        : ((thetaPos > 0 && thetaPos < 90) || (thetaPos > 180 && thetaPos < 270))
            ? (Math.abs(Math.cos(thetaRads)*chunkWidth)+Math.abs(Math.sin(thetaRads)*chunkHeight))
            : (Math.abs(Math.sin(thetaRads)*chunkWidth)+Math.abs(Math.cos(thetaRads)*chunkHeight));


    var endLabelWidth = parseFloat(entity.infoSets[infoSetIndex].textWidth)>0?entity.infoSets[infoSetIndex].textWidth:adjustedWidth;

    var labelG = document.createElementNS("http://www.w3.org/2000/svg","g");
    document.getElementById(entity.objectID).appendChild(labelG);

    labelG.setAttribute("class","labelG");

    var labelTextValue = entity.infoSets[infoSetIndex].displayName;

    var goodTextLines = [];
    var words = labelTextValue.split(" ");
    var leftovers = [];
    var currentLineTest = words;
    var unsorted = true;
    while(unsorted){
        var tempLabelText = document.createElementNS("http://www.w3.org/2000/svg","text");
        labelG.appendChild(tempLabelText);
        tempLabelText.textContent = currentLineTest.join(" ");
        if(parseFloat(tempLabelText.getBBox().width+(textPadding*2)) < endLabelWidth || currentLineTest.length == 1){
            goodTextLines.push(currentLineTest.join(" "));
            currentLineTest = leftovers;
            leftovers = [];
            unsorted = currentLineTest.length == 0?false:true;
        } else {
            leftovers.unshift(currentLineTest.pop());
        }

        labelG.removeChild(tempLabelText);
    }

    var labelRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
    labelG.appendChild(labelRect);

    var widestLineWidth = 0;
    for(line of goodTextLines){
        var labelTextLine = document.createElementNS("http://www.w3.org/2000/svg","text");
        labelG.appendChild(labelTextLine);
        labelTextLine.textContent = line;
        widestLineWidth = (widestLineWidth > labelTextLine.getBBox().width)?widestLineWidth:labelTextLine.getBBox().width;
    }

    var lineHeight = labelG.getElementsByTagName("text")[0].getBBox().height;
    var centerLineX = (widestLineWidth+(2*textPadding))/2;
    var rectHeight = 0;

    for(var lineTextIndex = 0; lineTextIndex < labelG.getElementsByTagName("text").length; lineTextIndex++) {
        labelG.getElementsByTagName("text")[lineTextIndex].setAttribute("x", centerLineX-(labelG.getElementsByTagName("text")[lineTextIndex].getBBox().width/2));
        labelG.getElementsByTagName("text")[lineTextIndex].setAttribute("y", parseFloat((textPadding*(lineTextIndex+1))+(lineTextIndex*lineHeight)));
        rectHeight = parseFloat(labelG.getElementsByTagName("text")[lineTextIndex].getAttribute("y"))+lineHeight+(textPadding*2);
    }

    labelRect.setAttribute("width", (widestLineWidth+(2*textPadding)));
    labelRect.setAttribute("height", rectHeight);

    labelG.setAttribute("transform","translate("+(chunkGCenterX-(labelRect.getAttribute("width")/2))+" "+
        (chunkGCenterY-(labelRect.getAttribute("height")/2))+") rotate("+parseFloat(-1*entity.orientation)+" "+
        (labelRect.getAttribute("width")/2)+" "+(labelRect.getAttribute("height")/2)+")"+
        ((entity.infoSets[infoSetIndex].textX || entity.infoSets[infoSetIndex].textY)?" translate("+((entity.infoSets[infoSetIndex].textX)?entity.infoSets[infoSetIndex].textX:"0")+" "+((entity.infoSets[infoSetIndex].textY)?entity.infoSets[infoSetIndex].textY:"0")+")":""));
}

function addEntity(entity) {

    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    whichFloor(entity.objectID, entity.format).appendChild(g);
    var objectClass = entity.format+(entity.objectClass==null?"":" " + entity.objectClass);
    g.setAttribute("id", entity.objectID);
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    g.appendChild(path);
    if(entity.format == "filingCabinet" || entity.format == "room" || entity.format == "supportBeam"){
        width = (entity.width === undefined || entity.width === "" || entity.width === null)?((entity.format=="room")?46:10):parseFloat(entity.width);
        height = (entity.height === undefined || entity.height === "" || entity.height === null)?((entity.format=="room")?70:10):parseFloat(entity.height);
        if(entity.format == "filingCabinet"){
            height=(entity.height === null || entity.height === undefined || entity.height === "")?5:entity.height;
            rows=(entity.rows === null || entity.rows === undefined || entity.rows === "")?1:entity.rows;
            columns=(entity.columns === null || entity.columns === undefined || entity.columns === "")?1:entity.columns;
            rowChunk = height/rows;
            columnChunk = width/columns;
        }
    }
    coorStr=""; 
    if(entity.type == '1'){
        coorStr = "M 0,0 L 5,0 L 5,15 A 15,15 0 0,0 20,0 L "+width+",0 L "+width+","+height+" L 0,"+height+" Z";
    } else if(entity.type == '2'){
        coorStr = "M 0,0 L "+(width-20)+",0 A 15,15 0 0,0 "+(width-5)+",15 L "+(width-5)+",0 L "+width+",0 L "+width+","+height+" L 0,"+height+" Z";
    } else if(entity.format == "filingCabinet"){
        for(k=0;k<rows;k++){
            for(j=0;j<columns;j++){
                coorStr+="M "+(columnChunk*j)+","+(rowChunk*k)+" L "+((columnChunk*j)+columnChunk)+","+(rowChunk*k)+" L "+((columnChunk*j)+columnChunk)+","+((rowChunk*k)+rowChunk)+" L "+(columnChunk*j)+","+((rowChunk*k)+rowChunk)+" Z";
            }
        }
    } else if(entity.format == "printer"){
        coorStr = "M 5,4 L 5,1 L 13,1 L 13,4 M 13,14 L 17,14 L 17,4 L 1,4 L 1,14 L 5,14 M 5,9 L 5,17 L 13,17 L 13,9 Z";
        objectClass += " "+(entity.infoSets[0].display?"networked":"local");
    } else if(entity.format == "supportBeam"){
        var coorStr = "M 1,1 L 1,"+entity.height+" L "+entity.width+","+entity.height+" L "+entity.width+",1 Z";
    } else{
        for(j = 0; j < entity.coorStrs.length; j++){
            coorStr += entity.coorStrs[j];
        }
    }

    if(entity.type == '3'){
        objectClass += " cubicle";
    }
    g.setAttribute("class",objectClass);
    
    path.setAttribute("d",coorStr);
    path.setAttribute("transform","translate("+(0-path.getBBox().x)+" "+(0-path.getBBox().y)+")");

    //g.setAttribute("transform","rotate("+(entity.orientation?entity.orientation:0)+")");

    var thetaPos = (360+(entity.orientation%360))%360;
    var thetaPosMod = ((360+(entity.orientation%360))%360)%90;
    var thetaRads = thetaPosMod*(Math.PI/180);
    var bbWidth = path.getBBox().width;
    var bbHeight = path.getBBox().height;
    var cosW = Math.cos(thetaRads)*bbWidth;
    var cosH = Math.cos(thetaRads)*bbHeight;

/*
    var shiftX = Math.abs((thetaPos == 0 || thetaPos >= 270)?0
        : (thetaPosMod == 0?(thetaPos == 90?bbHeight:bbWidth)
            : ((thetaPos > 180?0:cosH) + (thetaPos < 90?0:cosW)))) - path.getBBox().x;
    var shiftY = Math.abs((thetaPos == 0 || thetaPos <= 90)?0
        : (thetaPosMod == 0?(thetaPos == 180?bbHeight:bbWidth)
            : ((thetaPos > 270?0:cosH) + (thetaPos < 180?0:cosW)))) - path.getBBox().y;

*/
    var shiftX = Math.abs((thetaPos == 0 || thetaPos >= 270)?0
        : (thetaPosMod == 0?(thetaPos == 90?bbHeight:bbWidth)
            : ((thetaPos > 180?0:cosH) + (thetaPos < 90?0:cosW))));
    var shiftY = Math.abs((thetaPos == 0 || thetaPos <= 90)?0
        : (thetaPosMod == 0?(thetaPos == 180?bbHeight:bbWidth)
            : ((thetaPos > 270?0:cosH) + (thetaPos < 180?0:cosW))));
    //path.setAttribute("transform","translate("+shiftX+" "+shiftY+")");

    var endX = shiftX+parseFloat(entity.x);
    var endY = shiftY+parseFloat(entity.y);
    g.setAttribute("transform","rotate("+(entity.orientation?entity.orientation:0)+")");
    //g.setAttribute("transform","translate("+endX+" "+endY+") rotate("+(entity.orientation?entity.orientation:0)+")");
    g.setAttribute("transform","translate("+endX+" "+endY+") rotate("+(entity.orientation?entity.orientation:0)+")");

    if(entity.format == "room"){
        chunkify(g,entity);
    }
}