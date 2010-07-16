var niknoname = new Array();
niknoname[0] = "Vin";
niknoname[1] = "DN";
niknoname[2] = "MN";
niknoname[3] = "SN";
niknoname[4] = "AN";
niknoname[5] = "KN";
niknoname[6] = "KN";
niknoname[7] = "Vism";

var bookmarklink = new Array();
bookmarklink[0] = 100; // scroll distance for 1.htm
bookmarklink[1] = 0; // scroll distance for 2.htm
bookmarklink[2] = 3529; // scroll distance for 3.htm

var scrollmuch = 500; // default scroll distance 

var bookmarkwhere = new Array();
bookmarkwhere['a'] = '3#2#4#2';

function bookmarkf(let)
{
	var bmwa = bookmarkwhere[let].split('#');

	getplace(bmwa);
	importXML();
	document.getElementById('maf').scrollTop = bookmarklink[3];
}

function bookmarkc(let)
{
	if(let)
	{
		var name = let;
	}
	else 
	{
		var nameno = document.form.bmlist.selectedIndex;
		var name = document.form.bmlist.getElementsByTagName('option')[nameno].value;
		if (nameno == 0) return;
	}
	document.form.bmname.value = name;
	var bmx = '';
	
	// first move to the file using the DPR file
	
    var dpr = readFile('DPB'+name);
	var bmwa = dpr.split('#');
	
	getplace(bmwa);
	importXML();

	// next scroll using the DSC file
	
    var dsc = readFile('DPS'+name);
	document.getElementById('maf').scrollTop = dsc;
}

function bookmarks(let)
{
	var bookmarktemp = document.form.nik.selectedIndex + '#' + document.form.book.selectedIndex  + '#' + document.form.meta.selectedIndex  + '#' + document.form.volume.selectedIndex  + '#' + document.form.vagga.selectedIndex  + '#' + document.form.sutta.selectedIndex + '#' + document.form.section.selectedIndex + '#' + document.form.hier.value;
	
	// create first cookie for page
	
	var nameadd = document.form.bmname.value;
	nameadd = nameadd.replace(/"/g, '`');
	if (nameadd == 'showcookies') 
	{
		showmeallthecookies();
	}
	else if (nameadd == 'erasecookies') 
	{
		erasecookies();
	}
	else
	{
		//if (nameadd.length > 20) nameadd = nameadd.substring(0,20);
		if (nameadd.length == 0)
		{
			alert('Please enter a name for the bookmark');
			return null;
		}
		writeFile('DPB'+nameadd,bookmarktemp, "UTF-8");
		
		// create second cookie for scroll distance
		
       
		var cookscroll = document.getElementById('maf').scrollTop; // scroll distance for bookmark
		writeFile('DPS'+nameadd, cookscroll+"", "UTF-8");
		
		// create third cookie for description 
		
		var desquote = replacevelstandard(document.getSelection());
		
		desquote = desquote.replace(/;/g, "::");
		if (desquote) writeFile('DPD'+nameadd,desquote, "UTF-8");
		else writeFile('DPD'+nameadd,"no description", "UTF-8");
	
		// update cookie list in javascript.htm
		
		updatecookielist();
	}		
}

function showmeallthecookies()
{
	var ca = readDir();
		var name = '';
		var allcookies = '<form name="bkform"><h1>DPR Bookmarks</h1><table>';
	
		var numberb = 0;
		var cookietotalno = 0;
		for(var i=0;i < ca.length;i++) 
		{
			if (ca[i].substring(0,3) == 'DPB')
			{
				cookietotalno++;
				allcookies +=  '<tr><td>' + ca[i];
				
			}

		}
	if (cookietotalno == 1)  allcookies += '<hr><b>' + cookietotalno + ' Bookmark Stored</b>';
	else allcookies += '<hr><b>' + cookietotalno + ' Bookmarks Stored</b>';
	document.getElementById('mafa').innerHTML = '';
	document.getElementById('mafb').innerHTML = allcookies;
}

function updatecookielist()
{
    var ca = readDir('DPR');
    
    var allcookies = '<option>none</option>';
	for(var i=0;i < ca.length;i++) 
	{
		if (i == 0 && ca.length > 1) allcookies = '<option>select one</option>';
		
//        alert(ca[i].substring(ca[i].length-4,ca[i].length-1));
		if (ca[i].substring(0,3) == 'DPB')
		{
			
			name = ca[i].substring(3);
			if (name.length > 13) name2 = name.substring(0,10) + '...';
			else name2 = name;
			allcookies +=  '<option value="' + name + '">' + name2 + '</option>';
		}
	}
	document.form.bmlist.innerHTML = allcookies;	
}

function erasecookie(name)
{
	if (name)
	{
		var refreshbms = true;
	}
	else
	{
		var nameno = document.form.bmlist.selectedIndex;
		name = document.form.bmlist.getElementsByTagName('option')[nameno].value;
	}	
	var answer = confirm('Are you sure you want to erase the bookmark "' + name + '"?')
	if(answer) 
	{	
        eraseItem(name);
        updatecookielist();
		
		if (refreshbms)
		{
			bookmarkframe('refresh');
		}
	}
}

function erasecookies(gofrom)
{
	var answer = confirm('Are you sure you want to erase all of the stored bookmarks?')
	if(answer) 
	{	
        eraseAll();
		updatecookielist();
		if (gofrom) bookmarkframe('refresh');
	}
}

function bookmarkframe(refresh)
{
	moveframex('*',confmove[0],confmove[1],0);
    var ca = readDir();
    ca = ca.sort();
	if (ca.length < 2)
	{
		if (refresh) // coming from the erase function
		{
			document.getElementById('mafa').innerHTML = '';
			document.getElementById('mafb').innerHTML='<div  id = "c" align=center><br><br><h1>no bookmarks saved</h1>';
		}
		else alert('no bookmarks saved');
	}
	else
	{
		var name = '';
		var cloc = new Array();
		
		var numberb = 0;
		var cookietotalno = 0;	
		
		var allcookies = '<form name="bkform"><h2>DPR Bookmarks</h2><table width=100% border=0>';
	
		for(var i=0;i < ca.length;i++) 
		{
			numberb++;
			if (ca[i].substring(0,3) == 'DPB')
			{
				cookietotalno++;
				name = ca[i].substring(3);
				name = name.replace(/"/g, '`');
				cloc = readFile(ca[i]).split('#');
				cloc[1]++;
				cloc[2]++;
				cloc[3]++;
				cloc[4]++;
				cloc[5]++;
				cloc[6]++;
				if (cloc[7] == 'm') cloc[7] = 'att';
				else cloc[7] = 'mul';
				
				allcookies +=  '<tr><td><table width=100%><tr><td class="blueh"><b><a href="javascript:void(0)" onclick="bookmarkc(\'' + name + '\')">' + cookietotalno + '. ' + name + ' </b>('+ niknoname[cloc[0]] + '.' + cloc[1] + '.' + cloc[2] + '.' + cloc[3] + '.' + cloc[4] + '.' + cloc[5] + '.' + cloc[6] + ' - ' + cloc[7] + ')</a></td><td align=right width="64" class="blueh"><input value="+" title="click here to edit this bookmark" type="button" id="hiderbutton' + name + '" onClick="hiddenout(\'' + name + '\')"><input value="x" type="button" onClick="erasecookie(\'' + name + '\')"><tr><td><i><font id="title' + name + '">&nbsp;</font></i></tr></table></td></tr>';
				allcookies +=  '<tr><td><div class="hide" id="'+ name + '"><table width=100%><tr bgcolor="chartreuse"><td align=center><b>Old Name</b><td align=center><b>New Name</b><td><tr><td align=center>' + name + '<td align=center><input type=text value="" id="newname' + name + '" title="Enter a new name for this bookmark (max. 10 chars)" size=12><td align=center><input type=button value=change onClick="bookmarkxn(\'' + name + '\')" title="Change Name"></table></div></td></tr>';
				allcookies += '<tr><td align=center><div class="hide" id="html' + name + '"></div></tr></table></td></tr>';
					
			}	
		}
		allcookies += '</table></form>';
		if (cookietotalno == 1)  allcookies += '<hr><b>' + cookietotalno + ' Bookmark Stored</b>';
		else allcookies += '<hr><b>' + cookietotalno + ' Bookmarks Stored</b>';
		allcookies += ' - <input type="button" value="erase all" title="erase all stored bookmarks" onclick="erasecookies(\'go\')">';
		document.getElementById('mafa').innerHTML = '';
		document.getElementById('mafb').innerHTML = allcookies;
		
		// now add the descriptions
		
		var desc = '';
		var title = '';
		var html = '';
				
		for(var i=0;i < ca.length;i++) 
		{
            if (ca[i].substring(0,3) == 'DPD')
            {
				name = ca[i].substring(3);
				desc = replaceunistandard(readFile(ca[i]));
				desc = desc.replace(/::/g, ";");

				html = 'html' + name;
				title = 'title' + name;
				
				document.getElementById(html).innerHTML = '<table width=100%><tr bgcolor="yellow"><td><b>Old Description</b><td align=center><b>New Description</b><td><tr><td align=center id="olddesc' + name + '">' + desc + '<td align=center><textarea id="newdesc' + name + '" title="Enter a new description for this bookmark" value="' + desc + '"></textarea><td><input type="button" value="change" onClick="bookmarkxd(\'' + name + '\')" title="Change Description"></table>';
				document.getElementById(title).innerHTML = desc;
			}		
		}
	}
	if (!refresh) document.getElementById('maf').scrollTop = 0;

}


function bookmarkxd(name)
{
	var descloc = 'newdesc' + name;
	var desc = document.getElementById(descloc).value;
	desc = desc.replace(/\n/g, ' | ');
	writeFile("DPD"+name, desc, "UTF-8");
	bookmarkframe();
}
function bookmarkxn(name)
{
	var namloc = 'newname' + name;
	var nam = document.getElementById(namloc).value;

    changeName(name,nam);

	bookmarkframe();
	updatecookielist();
}

function bookmarksite(title, url){
if (document.all)
window.external.AddFavorite(url, title);
else if (window.sidebar)
window.sidebar.addPanel(title, url, "")
}
