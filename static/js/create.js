const characters = [];
function addRow() {
    const name = $('#characterName').val();
    const initVal = $('#characterInit').val();
    $('#theList').append(`<li>${name}: ${initVal}</li>`);
    characters.push({
        name: name,
        initiative: initVal
    });
    // $('#initForm').append(`<input type="hidden" name="charName" value="${name}">`);
    // $('#initForm').append(`<input type="hidden" name="charInit" value="${initVal}">`);

    $('#characterName').val('').focus();
    $('#characterInit').val('');
}

let mylambda = (arg, barg) => { return arg + barg }
let myf = function (arg, barg) { return arg + barg }

function handleSubmit() {
    // const data = JSON.stringify($('#initForm').serializeArray());
    // const data = JSON.stringify(characters);
    console.log(characters);
    $.post({
        url: '/create',
        data: JSON.stringify({ characters: characters }),
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
    })
        .done((foo) => { console.log('success', foo) })
        .fail(console.error);
    return false; // prevent form submit
}

function init() {
    $('#addCharacter').click(() => {
        addRow();
        return false; // prevent actual form submit
    });
    $('#characterName').focus();
    $('#initForm').submit(handleSubmit);
}

$(init);