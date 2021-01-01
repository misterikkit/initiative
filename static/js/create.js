const characters = [];

function addRow() {
    const name = $('#characterName').val();
    const initVal = $('#characterInit').val();
    const tmpl = $('#listItem').html();
    $('#theList').append(
        Mustache.render(tmpl, { name: name, initVal: initVal })
    );
    characters.push({
        name: name,
        initiative: initVal
    });
    // $('#initForm').append(`<input type="hidden" name="charName" value="${name}">`);
    // $('#initForm').append(`<input type="hidden" name="charInit" value="${initVal}">`);

    $('#characterName').val('').focus();
    $('#characterInit').val('');
}


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
        .done((info) => {
            if (info.gameId) {
                location.href = `/admin.html?gameID=${info.gameId}`;
            }
            console.error('Cannot use game ID from', info);
        })
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
    // Submit on ctrl+enter
    $('body').keypress((event) => {
        const ctrlKey = 10;
        if (event.keyCode === ctrlKey && event.ctrlKey) { handleSubmit(); }
    })
}

$(init);