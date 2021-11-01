$('#loadFile').change(function () {
    if ($('#loadFile').val() !== '') {
        for (let i = 0, file; file = $('#loadFile').prop('files')[i]; i++){
            let reader = new FileReader();
            reader.onload = function () {
                $("#mapList").append($("<option>").val(reader.result).text(baseName(file.name)));
            }
            reader.readAsDataURL(file);
        }
    }
});

$('#mapList').change(function () {
    $('#animePreview').width($('.movie-preview-canvas').width());
    $('#animePreview').attr('src', $(this).children(':selected').val());
});

$('#mapAddBtn').click(function () {
    if ($('#mapList').prop('selectedIndex') < 0) {
        return;
    }

    project.addObject(
        new ProjectObject(
            $('#mapList').children(':selected').text(),
            $('#mapList').children(':selected').val(),
            1
        ));
    project.reflash();

    if (project.objects.length == 1) {
        let obj = project.getObject(0);
        $('#movieWidth').val(obj.image.width);
        $('#movieHeight').val(obj.image.height);
    }
});

$('#mapDelBtn').click(function () {
    if ($('#mapList').prop('selectedIndex') < 0) {
        return;
    }
    $('#mapList > option:selected').remove();
});