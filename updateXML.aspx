<%@ Page LANGUAGE="VB" SMARTNAVIGATION="false" debug="true"%>
<%@ Import Namespace="System.Xml" %>

<script runat="server" >
  Sub addAttributeToXmlNode(ByVal xmlDoc As XmlDocument, ByVal node As XmlNode, ByVal attributeName As String, ByVal attributeValue As String)
    Dim attr As XmlAttribute = xmlDoc.CreateAttribute(attributeName)
    attr.value = attributeValue
    Response.Write(node)
    node.Attributes.Append(attr)
  End Sub

  Sub addXmlNodeList(ByVal xmlDoc As XmlDocument, ByVal startingNode As XmlNode, ByVal nodeName As String, ByVal postDataNameBase As String)

    Dim index As Integer = 0
    Dim name As String = postDataNameBase+"-"+index.toString()
    While Request(name) <> "" 'if it exists
      If Request(name).length > 0 Then
        Dim newElem As XmlElement = xmlDoc.CreateElement(nodeName)
        newElem.innerText = Request.Form(name)
        startingNode.AppendChild(newElem)
      End If
      index += 1
      name = postDataNameBase+"-"+index.toString()
    End While
    ' nodes are now created
  End Sub

  Sub removeXmlNodeList(ByVal xmlDoc As XmlDocument, ByVal startingNode As XmlNode, ByVal nodeName As String)

    Dim tempPath As String = "./"+nodeName
    Dim nodeList As XmlNodeList = startingNode.SelectNodes(tempPath)
    Dim individualNode As XmlNode
    Response.Write(startingNode.OuterXml)
    
    For Each individualNode In nodeList
      startingNode.RemoveChild(individualNode)
    Next individualNode 
    'nodes are now destroyed
  End Sub

  Sub addInfoSetsToXml(ByVal xmlDoc As XmlDocument, ByVal startingNode As XmlNode, ByVal format As String)

    Dim index As Integer = 0
    Dim display = Request.Form("display"+"-"+index.toString()+"-true")

    While display <> "" 'if it exists
      If display.length > 0 Then
        Dim newInfoSet As XmlElement = xmlDoc.CreateElement("infoSet")

        'newElem.innerText = Request.Form(name)
        startingNode.AppendChild(newInfoSet)
        If Request.Form("display-"+index.ToString()+"-true") = "yes" Then
          newInfoSet.removeAttribute("display")
        Else If Request.Form("display-"+index.ToString()+"-true") = "no" Then
          newInfoSet.setAttribute("display", "false")
        End If

        If Request.Form("textX"+"-"+index.toString()) <> "" Then
          newInfoSet.setAttribute("textX", Request.Form("textX"+"-"+index.toString()))
        Else If Request.Form("textX"+"-"+index.toString()).length = 0
          newInfoSet.removeAttribute("textX")
        End If

        If Request.Form("textY"+"-"+index.toString()) <> "" Then
          newInfoSet.setAttribute("textY", Request.Form("textY"+"-"+index.toString()))
        Else If Request.Form("textY"+"-"+index.toString()).length = 0
          newInfoSet.removeAttribute("textY")
        End If
        If Request.Form("textWidth"+"-"+index.toString()) <> "" Then
          newInfoSet.setAttribute("textWidth", Request.Form("textWidth"+"-"+index.toString()))
        Else If Request.Form("textWidth"+"-"+index.toString()).length = 0
          newInfoSet.removeAttribute("textWidth")
        End If

        If Request.Form("wallPlateSeq-"+index.ToString()) = "none" Then
          newInfoSet.RemoveAttribute("assignedWallPlate")
        Else If Request.Form("wallPlateSeq-"+index.ToString()+"-true") IsNot "none" Then
          newInfoSet.setAttribute("assignedWallPlate", Request.Form("wallPlateSeq-"+index.ToString()))
        End If

        Dim newName As XmlElement = xmlDoc.CreateElement("name")
        newName.innerText = Request.Form("fullName-"+index.toString())

        If format = "room" Then

          Dim phoneNum As XmlElement = xmlDoc.CreateElement("phoneNum")
          phoneNum.innerText = Request.Form("phoneNum-"+index.toString())
          newInfoSet.AppendChild(phoneNum)
          Dim displayName As String = Request.Form("displayName-"+index.toString())
          newName.setAttribute("displayName", displayName)
        End If
        newInfoSet.AppendChild(newName)

        If format = "printer" Then
          'faxWallPlateSeq
          If Request.Form("faxWallPlateSeq-"+index.ToString()) = "none" Then
            newInfoSet.RemoveAttribute("assignedFaxWallPlate")
          Else If Request.Form("faxWallPlateSeq-"+index.ToString()+"-true") IsNot "none" Then
            newInfoSet.setAttribute("assignedFaxWallPlate", Request.Form("faxWallPlateSeq-"+index.ToString()))
          End If
          'model
          Dim model As XmlElement = xmlDoc.CreateElement("model")
          model.innerText = Request.Form("model-"+index.toString())
          newInfoSet.AppendChild(model)
          Dim faxNum As XmlElement = xmlDoc.CreateElement("faxNum")
          faxNum.innerText = Request.Form("faxNum-"+index.toString())
          newInfoSet.AppendChild(faxNum)
          Dim ipAddress As XmlElement = xmlDoc.CreateElement("ipAddress")
          ipAddress.innerText = Request.Form("ipAddress-"+index.toString())
          newInfoSet.AppendChild(ipAddress)
        End If

      End If
      index += 1
      display = Request.Form("display"+"-"+index.toString())
    End While
    ' nodes are now created
  End Sub


  Sub Page_Load 'start here'
    Dim sItem
    For Each sItem In Request.Form
      Response.Write(sItem)
      Response.Write(" - [" & Request.Form(sItem) & "]" )
      Response.Write("<br>")
    Next
    Response.Write("<br>")
    dim format As String = Request.Form("format")
    XmlSource.DataFile = format+"s.xml"
    dim oldObjectIDFromPOST
    oldObjectIDFromPOST=Request.Form("oldObjectID")

    Dim myXml As New XmlDocument

    myXml = CType(XmlSource.GetXmlDocument(), XmlDocument)
    Dim node As XmlNode
    If Request.Form("mod") = "update" Then
      Dim path As String = format+"s/"+format+"[@objectID='"+oldObjectIDFromPOST+"']"
      node = myXml.SelectSingleNode(path)
    Else If Request.Form("mod") = "add" Then
      Dim root As XmlNode = myXml.SelectSingleNode(format+"s")
      Dim newNode As XmlElement = myXml.CreateElement(format)
      root.AppendChild(newNode)
      newNode.setAttribute("objectID", Request.Form("objectID"))
      node = myXml.SelectSingleNode(format+"s/"+format+"[@objectID='"+Request.Form("objectID")+"']")
    End If
    If Request.Form("mod") = "swap" Then
      If Request.Form("sourceInfoSetID") <> "empty" Then
        If Request.Form("targetInfoSetID") <> "empty" Then 'neither are empty rooms
          'get source
          Dim sourceEntity As XmlNode = myXml.SelectSingleNode(format+"s/"+format+"[@objectID='"+Request.Form("sourceEntityID")+"']")
          Dim sourceEntityList As XmlNodeList = sourceEntity.SelectNodes("infoSet")
          Dim sourceInfoSetIndex = Asc(Request.Form("sourceInfoSetID")) - Asc("A")
          Dim sourceInfoSetNode As XmlNode = sourceEntityList.Item(sourceInfoSetIndex)
          Dim sourceInfoSetNodeClone As XmlNode = sourceInfoSetNode.Clone()
          'get target
          Dim targetEntity As XmlNode = myXml.SelectSingleNode(format+"s/"+format+"[@objectID='"+Request.Form("targetEntityID")+"']")
          Dim targetEntityList As XmlNodeList = targetEntity.SelectNodes("infoSet")
          Dim targetInfoSetIndex = Asc(Request.Form("targetInfoSetID")) - Asc("A")
          Dim targetInfoSetNode As XmlNode = targetEntityList.Item(targetInfoSetIndex)
          Dim targetInfoSetNodeClone As XmlNode = targetInfoSetNode.Clone()
          'swap them
          sourceEntity.ReplaceChild(targetInfoSetNodeClone, sourceInfoSetNode)
          targetEntity.ReplaceChild(sourceInfoSetNodeClone, targetInfoSetNode)
        Else 'target is empty, source is not
          'get source
          Dim sourceEntity As XmlNode = myXml.SelectSingleNode(format+"s/"+format+"[@objectID='"+Request.Form("sourceEntityID")+"']")
          Dim sourceEntityList As XmlNodeList = sourceEntity.SelectNodes("infoSet")
          Dim sourceInfoSetIndex = Asc(Request.Form("sourceInfoSetID")) - Asc("A")
          Dim sourceInfoSetNode As XmlNode = sourceEntityList.Item(sourceInfoSetIndex)
          Dim sourceInfoSetNodeClone As XmlNode = sourceInfoSetNode.Clone()
          sourceEntity.RemoveChild(sourceInfoSetNode)
          'get target
          Dim targetEntity As XmlNode = myXml.SelectSingleNode(format+"s/"+format+"[@objectID='"+Request.Form("targetEntityID")+"']")
          'append source to empty target
          targetEntity.AppendChild(sourceInfoSetNodeClone)
        End If
      Else 'source is empty
        If Request.Form("targetInfoSetID") <> "empty" Then 'target is not empty
          'get source
          Dim sourceEntity As XmlNode = myXml.SelectSingleNode(format+"s/"+format+"[@objectID='"+Request.Form("sourceEntityID")+"']")
          'get target
          Dim targetEntity As XmlNode = myXml.SelectSingleNode(format+"s/"+format+"[@objectID='"+Request.Form("targetEntityID")+"']")
          Dim targetEntityList As XmlNodeList = targetEntity.SelectNodes("infoSet")
          Dim targetInfoSetIndex = Asc(Request.Form("targetInfoSetID")) - Asc("A")
          Dim targetInfoSetNode As XmlNode = targetEntityList.Item(targetInfoSetIndex)
          Dim targetInfoSetNodeClone As XmlNode = targetInfoSetNode.Clone()
          targetEntity.RemoveChild(targetInfoSetNode)
          'get target
          'append target to empty source
          sourceEntity.AppendChild(targetInfoSetNodeClone)
        End If
      End If
    Else
      'update objectID'
      addAttributeToXmlNode(myXml, node, "objectID", Request.Form("floorPrefix")+"-"+Request.Form("objectID"))
      'update X'
      addAttributeToXmlNode(myXml, node, "x", Request.Form("x"))
      'update Y'
      addAttributeToXmlNode(myXml, node, "y", Request.Form("y"))
      'update class if needed
      If Request.Form("objectClass") <> "" Then
        addAttributeToXmlNode(myXml, node, "objectClass", Request.Form("objectClass"))
      Else If Request.Form("objectClass").length = 0
        node.Attributes.RemoveNamedItem("objectClass")
      End If
      'update height and width if needed
      If Request.Form("height") <> "" Then
        addAttributeToXmlNode(myXml, node, "height", Request.Form("height"))
      Else If Request.Form("height").length = 0
        node.Attributes.RemoveNamedItem("height")
      End If

      If Request.Form("width") <> "" Then
        addAttributeToXmlNode(myXml, node, "width", Request.Form("width"))
      Else If Request.Form("width").length = 0
        node.Attributes.RemoveNamedItem("width")
      End If

      'update orientation if needed'
      If Request.Form("orientation") <> "" Then
        addAttributeToXmlNode(myXml, node, "orientation", Request.Form("orientation"))
      Else If Request.Form("orientation").length = 0
        node.Attributes.RemoveNamedItem("orientation")
      End If


      If format = "furniture" Then
        'wipe out existing coorStrs and recreate them
        removeXmlNodeList(myXml, node, "coorStr")
        addXmlNodeList(myXml, node, "coorStr", "coorStrs") 
      End If



      If format = "filingCabinet" Then
        'update columns and rows if needed
        If Request.Form("columns") <> "" Then
          addAttributeToXmlNode(myXml, node, "columns", Request.Form("columns"))
        Else If Request.Form("columns").length = 0
          node.Attributes.RemoveNamedItem("columns")
        End If

        If Request.Form("rows") <> "" Then
          addAttributeToXmlNode(myXml, node, "rows", Request.Form("rows"))
        Else If Request.Form("rows").length = 0
          node.Attributes.RemoveNamedItem("rows")
        End If
      End If



      If format = "room" Then

        'update type
        addAttributeToXmlNode(myXml, node, "type", Request.Form("type"))

        'wipe out existing infosets and recreate them if needed
        removeXmlNodeList(myXml, node, "infoSet")
        addInfoSetsToXml(myXml, node, format)

        'wipe out existing coorStrs and recreate them if needed
        removeXmlNodeList(myXml, node, "coorStr")
        If Request.Form("type").toString() = "3" Or Request.Form("type").toString() = "4" Then
          addXmlNodeList(myXml, node, "coorStr", "coorStrs")
        Else If Request.Form("type").toString() = "1" Or Request.Form("type").toString() = "2" Then
          removeXmlNodeList(myXml, node, "height")
          removeXmlNodeList(myXml, node, "width")
        End If

        'wipe out existing wallPlateNums and recreate them
        removeXmlNodeList(myXml, node, "wallPlateNum")
        If Request.Form("wallPlateNums-0") <> "" Then
          addXmlNodeList(myXml, node, "wallPlateNum", "wallPlateNums")
        End If
      End If

      If format = "printer" Then

        'wipe out existing infosets and recreate them if needed
        removeXmlNodeList(myXml, node, "infoSet")
        addInfoSetsToXml(myXml, node, format)

        'wipe out existing wallPlateNums and recreate them
        removeXmlNodeList(myXml, node, "wallPlateNum")
        If Request.Form("wallPlateNums-0") <> "" Then
          addXmlNodeList(myXml, node, "wallPlateNum", "wallPlateNums")
        End If
        removeXmlNodeList(myXml, node, "faxWallPlateNum")
        If Request.Form("faxWallPlateNums-0") <> "" Then
          addXmlNodeList(myXml, node, "faxWallPlateNum", "faxWallPlateNums")
        End If

      End If



      If format = "wall" Then
        'wipe out existing coorStrs and recreate them
        removeXmlNodeList(myXml, node, "coorStr")
        addXmlNodeList(myXml, node, "coorStr", "coorStrs")
      End If
    End If

    'changes value of last modified date node
    If format = "room" Then
      Dim currentDate As Date = Date.Now
      Dim dateNode As XmlNode
      Dim path As String = format+"s/lastModified"
      dateNode = myXml.SelectSingleNode(path)
      dateNode.innerText = currentDate.toString("d")
    End If


    XmlSource.Save()
    Repeater1.DataBind()
    Response.Redirect("admin.html")

  End Sub 'on page load
</script>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
</head>
<body>
    <form id="Form1" runat="server" >

      <asp:XmlDataSource
        runat="server"
        ID="XmlSource"
        EnableViewState="True"
        EnableCaching="False" />

        <asp:Repeater
        runat="server"
        ID="Repeater1"
        DataSourceID="XmlSource" >
          <ItemTemplate >
            <h1><%# XPath ("@objectID") %> </h1>
          </ItemTemplate>
      </asp:Repeater>
</form>
</body>