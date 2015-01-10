// ID of div that is to contain all of the map
var addToDiv = document.createElement("div");

var masterXML_DOMs = new Object();
var masterEntityContainer = new Object();
var masterEntityCurrent = new Object();
var lastModifiedDate;
var usingIE = (navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0);



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



window.onload = function () {
    document.getElementById("searchBar").setAttribute("class","fadedOut");
    setClientFloor();
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

    //handle the rooms next
    //format = "room";
    loadFormat("wall",false);
    loadFormat("filingCabinet",false);
    loadFormat("furniture",false);
    loadFormat("room",true);
    //loadFormat("printer",true);
    loadFormat("supportBeam",false);
    //loadFormat("zone",false);

    showLastModified(lastModified);

    // move the U-floorG to the back so it doesn't appear in front of anything
    var uFloorG = roomSVG.removeChild(document.getElementById("U-floorG"));
    roomSVG.insertBefore(uFloorG, roomSVG.querySelectorAll(".floorG")[0]);

    switchFloorView(document.getElementById("floorSelection").value);

    document.getElementById("searchBar").setAttribute("class","fadeThisIn");
    document.getElementById("splashG").setAttribute("class","fadeThisOut");


};

function findChildren(elementNode){
    children = [];
    var i = elementNode.childNodes.length;
    while(i--){
        if(elementNode.childNodes[i].nodeType == 1) children.unshift(elementNode.childNodes[i]);
    } 
    return children;
}


function setClientFloor(){
    //wizardry to get LAN IP addresses

    var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    var startOnSix = true;

    if (RTCPeerConnection) (function () {
        var rtc = new RTCPeerConnection({iceServers:[]});
        if (window.mozRTCPeerConnection) { 
            rtc.createDataChannel('', {reliable:false});
        };
        
        rtc.onicecandidate = function (e) {
            if (e.candidate) grepSDP("a="+e.candidate.candidate);
        };
        rtc.createOffer(function (offerDesc) {
            grepSDP(offerDesc.sdp);
            rtc.setLocalDescription(offerDesc);
        }, function (e) { console.warn("offer failed", e); });
        
        
        var addrs = Object.create(null);
        addrs["0.0.0.0"] = false;
        function updateIP(newAddr) {
            if (newAddr in addrs) return;
            else addrs[newAddr] = true;
            var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
            for(i = 0; i < displayAddrs.length; i++) {
                if(/^\d+\.\d+\./.exec(displayAddrs[i]) == "192.168."){
                    var detectedSubnet = /\d+\.\d+\.(\d+)\.\d+/.exec(displayAddrs[i])[1];
                    startOnSix = !(detectedSubnet == "5");

                    findChildren(document.getElementById("floorSelection"))[(startOnSix?0:1)].removeAttribute("selected");
                    findChildren(document.getElementById("floorSelection"))[(!startOnSix?0:1)].setAttribute("selected","selected");
                }
            }
        }
        
        function grepSDP(sdp) {
            var hosts = [];
            sdp.split('\r\n').forEach(function (line) {
                if (~line.indexOf("a=candidate")) {
                    var parts = line.split(' '),
                        addr = parts[4],
                        type = parts[7];
                    if (type === 'host') updateIP(addr);
                } else if (~line.indexOf("c=")) {
                    var parts = line.split(' '),
                        addr = parts[2];
                    updateIP(addr);
                }

            });
        }
    })();
    

}

function showLastModified(lastModified){
    uFloorG = document.getElementById("U-floorG");
    var lmText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    uFloorG.appendChild(lmText);
    lmText.setAttribute("id","lmText");
    lmText.textContent = lastModified;
    lmText.setAttribute("transform","translate(980 810)");

}

function switchFloorView(floor){
    document.getElementById("5-floorG").setAttribute("opacity", floor=="5"?"1":"0");
    document.getElementById("6-floorG").setAttribute("opacity", floor=="6"?"1":"0");
    document.getElementById("5-floorG").setAttribute("style", "display: "+(floor=="5"?"auto;":"none;"));
    document.getElementById("6-floorG").setAttribute("style", "display: "+(floor=="6"?"auto;":"none;"));
    while (document.querySelectorAll(".detailsG")[0] !== undefined) {
        document.querySelectorAll(".detailsG")[0].parentNode.removeChild(document.querySelectorAll(".detailsG")[0]);

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
        addEntity(masterEntityContainer[format][id]);
    }
    if(format == "room"){
        lastModified = XMLDoc.getElementsByTagName("lastModified")[0].childNodes[0].nodeValue;
    }
}

function checkEnter(event){
    if(event.which == "13"){
        search();
    }
}

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
            var modifiedName = "";
            if(/^\s*[a-z]\.\s*$/.exec(splitName[1])){
                splitName.splice(1,1);
                modifiedName = splitName.join(" ");
            }
            if(fullName.indexOf(query.toLowerCase()) != -1 || modifiedName.indexOf(query.toLowerCase()) != -1 ){
                potential.push(room+"-"+String.fromCharCode(65 + parseInt(infoSet,10)));
            }
        }
    }
    var currentFloor = document.getElementById("floorSelection").value;
    var hiddenMatches = [];
    for(i = 0; i < potential.length; i++){
        if(potential[i].charAt(0) != currentFloor) hiddenMatches.push(potential[i]);
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
    while (document.querySelectorAll(".clone")[0] !== undefined) {
        document.querySelectorAll(".clone")[0].parentNode.removeChild(document.querySelectorAll(".clone")[0]);
    }
    while (document.querySelectorAll(".detailsG")[0] !== undefined) {
        document.querySelectorAll(".detailsG")[0].parentNode.removeChild(document.querySelectorAll(".detailsG")[0]);
    }
    document.getElementById("hiddenResults").innerHTML = "";
}

function lookAtMe(potential, hiddenMatches){
    for(i = 0; i < potential.length; i++){
        var sourceNode = document.getElementById(potential[i]);
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


function displayInfo(event, format){
    clearSearch();

    var roomSVG = document.getElementById("roomSVG");
    var target = event.target.parentNode;
    var room = target.parentNode;
    
    var roomBB = room.getBBox();
    roomL = parseFloat(getEntity("room",room.getAttribute("id")).x);
    roomT = parseFloat(getEntity("room",room.getAttribute("id")).y);

    var theta = parseFloat(/rotate\(([+-]?\d*\.?\d+([eE][+-]?\d+)?)\)/.exec(room.getAttribute("transform"))[1]);
    var thetaPos = (360+(theta%360))%360;
    var thetaPosMod = ((360+(theta%360))%360)%90;
    var thetaRads = thetaPosMod*(Math.PI/180);
    var roomWidth = ((thetaPosMod == 0)
        ? ((thetaPos%180 == 0)?roomBB.width:roomBB.height)
        : ((thetaPos > 0 && thetaPos < 90) || (thetaPos > 180 && thetaPos < 270))
            ? (Math.abs(Math.cos(thetaRads)*roomBB.width)+Math.abs(Math.sin(thetaRads)*roomBB.height))
            : (Math.abs(Math.sin(thetaRads)*roomBB.width)+Math.abs(Math.cos(thetaRads)*roomBB.height)));
    var roomHeight = ((thetaPosMod == 0)
        ? ((thetaPos%180 == 0)?roomBB.height:roomBB.width)
        : ((thetaPos > 0 && thetaPos < 90) || (thetaPos > 180 && thetaPos < 270))
            ? (Math.abs(Math.sin(thetaRads)*roomBB.width)+Math.abs(Math.cos(thetaRads)*roomBB.height))
            : (Math.abs(Math.cos(thetaRads)*roomBB.width)+Math.abs(Math.sin(thetaRads)*roomBB.height)));
    var roomR = roomL+roomWidth;
    var roomB = roomT+roomHeight;


    var textPadding = 10;

    var infoSetIndex = parseInt(/-([^\s-])(?=$)/.exec(target.getAttribute("id"))[1].toUpperCase().charCodeAt(0)-65) || 0;

    var currentEntity = getEntity(format, /^([^\s-]+-[^\s-]+)(?=-[^\s-]+$)/.exec(target.getAttribute("id"))[1]);

    var fullName = currentEntity.infoSets[infoSetIndex].fullName;
    var extension = currentEntity.infoSets[infoSetIndex].phoneNum || "";

    var detailsG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    roomSVG.appendChild(detailsG);
    detailsG.setAttribute("class","detailsG");
    detailsG.setAttribute("id","detailsG");

    //make drop shadow
    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    detailsG.appendChild(defs);
    var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    defs.appendChild(filter);
    filter.setAttribute("id","dropShadowFilter");
    filter.setAttribute("width","200%");
    filter.setAttribute("height","200%");
    var feOffset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
    filter.appendChild(feOffset);
    feOffset.setAttribute("result","offOut");
    feOffset.setAttribute("in","SourceGraphic");
    feOffset.setAttribute("dx","5");
    feOffset.setAttribute("dy","5");
    var feColorMatrix = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
    filter.appendChild(feColorMatrix);
    feColorMatrix.setAttribute("result","matrixOut");
    feColorMatrix.setAttribute("in","offOut");
    feColorMatrix.setAttribute("type","matrix");
    feColorMatrix.setAttribute("values","0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .75 0");
    var feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    filter.appendChild(feGaussianBlur);
    feGaussianBlur.setAttribute("result","blurOut");
    feGaussianBlur.setAttribute("in","matrixOut");
    feGaussianBlur.setAttribute("stdDeviation","4");
    var feBlend = document.createElementNS("http://www.w3.org/2000/svg", "feBlend");
    filter.appendChild(feBlend);
    feBlend.setAttribute("in","SourceGraphic");
    feBlend.setAttribute("in2","blurOut");
    feBlend.setAttribute("mode","normal");

    var detailsGBG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    detailsG.appendChild(detailsGBG);
    detailsGBG.setAttribute("class","detailsGBG");
    detailsGBG.setAttribute("id","detailsGBG");

    var nameText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    detailsG.appendChild(nameText);
    nameText.setAttribute("id","fullName");
    nameText.setAttribute("x",textPadding);
    nameText.setAttribute("y",textPadding);
    nameText.textContent = fullName;

    var nameTextHeight = nameText.getBBox().height;
    var nameTextWidth = nameText.getBBox().width;

    var extText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    detailsG.appendChild(extText);
    extText.setAttribute("id","extension");
    extText.setAttribute("x",textPadding*2);
    extText.setAttribute("y",(textPadding*2)+nameTextHeight);
    extText.textContent = "ext. "+extension;

    var extTextHeight = extText.getBBox().height;
    var extTextWidth = extText.getBBox().width;
    
    detailsGBG.setAttribute("width", detailsG.getBBox().width+(2*textPadding));
    detailsGBG.setAttribute("height", detailsG.getBBox().height+(textPadding*2));

    var roomCenterX = roomL+(roomWidth/2);
    var roomCenterY = roomT+(roomHeight/2);


    var svgCenterX = roomSVG.getBBox().width/2;
    var svgCenterY = roomSVG.getBBox().height/2;


    detailsG.setAttribute("transform","translate(" +
        (roomCenterX<svgCenterX?roomL:roomR-detailsGBG.getBBox().width) + " " +
        (roomCenterY<svgCenterY?roomB:roomT-detailsGBG.getBBox().height) + " )");
    
    

    detailsGBG.setAttribute("filter","url(#dropShadowFilter)");
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
    entity.orientation = parseFloat(thisXMLDOM.getAttribute("orientation")) || 0;
    if(entity.format == "printer"){
        entity.orientation = null;
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
        g.setAttribute("class", (/^[\*\s]*$/.exec(entity.infoSets[k].displayName))?"emptyRoomChunk":("roomChunk" + (entity.infoSets[k].display?"":" noDisplay")));
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

        if(!(/^[\*\s]*$/.exec(entity.infoSets[k].displayName))) applyLabel(entity, k, wide);
    }
}

function applyLabel(entity, infoSetIndex, wide){
    var textPadding = 2;
    var chunkG = document.getElementById(entity.objectID).querySelectorAll(".roomChunk")[infoSetIndex];
    var chunkWidth = chunkG.querySelectorAll(".roomChunkBG")[0].getAttribute("width");
    var chunkHeight = chunkG.querySelectorAll(".roomChunkBG")[0].getAttribute("height");
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
    for(l = 0; l < goodTextLines.length; l ++){
        var labelTextLine = document.createElementNS("http://www.w3.org/2000/svg","text");
        labelG.appendChild(labelTextLine);
        labelTextLine.textContent = goodTextLines[l];
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

    labelRect.setAttribute("width", (widestLineWidth+(3*textPadding)));
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
        //filter out empty rooms
        for(j = 0; j < entity.infoSets.length; j ++){
            if(!(/^[\*\s]*$/.exec(entity.infoSets[j].displayName))) {
                chunkify(g,entity);
                break;
            }
        }
    }
}