var usersJson = '';
var resultHtml = '';
var editHtml = '';
var master = [];
var seen = [];

$(document).ready(function() {
	loadHtml(function() { 
		$('#searchText').on('keyup', function () { searchText(); });
		$('#createButton').click(function() { createClick(); });
		initialize(); 
	});
});

function loadHtml(callback) {
	$.get('/html/body.html', function (data) { $('body').append(data); });
	$.get('/html/resultRow.html', function (data) { resultHtml = data; callback(); });
	$.get('/html/editRow.html', function (data) { editHtml = data; });
}

function initialize() {
	getUsers(function() {
		$('#results').children().remove();
		for (var i = 0; i < usersJson.length; i++) {
			$('#results').append(
				resultHtml.f(
					usersJson[i].id, 
					usersJson[i].email,
					usersJson[i].firstname,
					usersJson[i].lastname
				)
			);
		}
		$('.editButton').click(function(e) { editClick(e); });
		$('.deleteButton').click(function(e) { deleteClick(e); });
	});
}



function getUsers(callback) {
	$.get('getUsers', function(data) {
		usersJson = data;
		callback();
	},'json');
}

function searchText() {
	master = [];
    seen = [];
    var qry = $('#searchText').val().toLowerCase();
    if (qry.length > 3) {
        searchEmail(qry, function () {
            searchName(qry, function () {
                displayResults();
            });
        });
    } else { 
		initialize(); 
	}
}

function searchEmail(qry, callback) {
    for (var i = 0; i < usersJson.length; i++) {
        if (usersJson[i].email != null) {
            if (usersJson[i].email.toLowerCase().indexOf(qry) > -1 && seen.indexOf(usersJson[i].id) == -1) {
                try {
					master.push(usersJson[i]);
					seen.push(usersJson[i].id);
                } catch (err) { /* do nothing */ }
            }
        }
    }
    callback();
}

function searchName(qry, callback) {
    for (var i = 0; i < usersJson.length; i++) {
        if (usersJson[i].firstname != null) {
            var name = usersJson[i].firstname.toLowerCase() + ' ' + usersJson[i].lastname.toLowerCase();
            if (name.indexOf(qry) > -1 && seen.indexOf(usersJson[i].id) == -1) {
                try {
					master.push(usersJson[i]);
					seen.push(usersJson[i].id);
                } catch (err) { /* do nothing */ }
            }
        }
    }
    callback();
}

function displayResults() {
	$('#results').children().remove();
	for (var i = 0; i < master.length; i++) {
		$('#results').append(resultHtml.f(
			master[i].id,
			master[i].email,
			master[i].firstname,
			master[i].lastname
		))
	}
}

function createClick() {
	$.post('addUser', {
		email: $('#createEmail').val(),
		fname: $('#createFName').val(),
		lname: $('#createLName').val()
	}, function(data) {
		$('#message').hide().html(data).fadeIn(1500).fadeOut(1500);
		initialize();
	});
}

function editClick(e) {
	var id = e.currentTarget.id.split('-')[1];
	$('#resultRow-' + id).replaceWith(
		editHtml.f(
			id, 
			$('#userEmail-' + id).html(), 
			$('#userFName-' + id).html(), 
			$('#userLName-' + id).html()
		)
	);
	$('.cancelButton').click(function(e) { cancelClick(e); });
	$('.saveButton').click(function(e) { saveClick(e); });
}

function deleteClick(e) {
	var id = e.currentTarget.id.split('-')[1];
	$.post('deleteUser', { id: id }, function(data) {
		$('#message').hide().html(data).fadeIn(1500).fadeOut(1500);
		initialize();
	});
}

function cancelClick(e) {
	var id = e.currentTarget.id.split('-')[1];
	swapEditToResult(id);
}

function swapEditToResult(id) {
	$('#editRow-' + id).replaceWith(
		resultHtml.f(
			id, 
			$('#editEmail-' + id).val(), 
			$('#editFName-' + id).val(), 
			$('#editLName-' + id).val()
		)
	);
	$('.editButton').click(function(e) { editClick(e); });
	$('.deleteButton').click(function(e) { deleteClick(e); });
}

function saveClick(e) {
	var id = e.currentTarget.id.split('-')[1];
	$.post('updateUser', {
		id: id,
		email: $('#editEmail-' + id).val(),
		fname: $('#editFName-' + id).val(),
		lname: $('#editLName-' + id).val(),
	}, function(data) {
		$('#message').hide().html(data).fadeIn(1500).fadeOut(1500);
		// swapEditToResult(id);
		initialize();
	});
}

String.prototype.f = function () { var args = arguments; return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; }); };











































































