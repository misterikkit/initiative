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

    $('#characterName').val('').focus();
    $('#characterInit').val('');
}

function handleSubmit() {
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
        const enterKey = 10;
        if (event.keyCode === enterKey && event.ctrlKey) { handleSubmit(); }
    })
}

$(init);