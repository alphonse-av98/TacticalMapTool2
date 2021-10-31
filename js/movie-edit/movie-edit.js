var project = new Project();

function Project() {
    this.objects = [];
    this.encoder;
}

Project.prototype.addObject = function (object) {
    this.objects.push(object);
}

Project.prototype.removeObject = function (index) {
    this.objects.splice(index, 1);
}

Project.prototype.allRemoveObject = function () {
    this.objects = [];
}

Project.prototype.getObject = function (index) {
    return this.objects[index];
}

Project.prototype.updateObject = function (index,object) {
    this.objects[index] = object;
}

Project.prototype.allUpdateWaittime = function (displayTime) {
    for (let i = 0; i < this.objects.length; i++){
        this.objects[i].displayTime = displayTime;
        $('#displayTime_' + i).val(displayTime);
    }
}

Project.prototype.getDisplayTimeMsecGcd = function () {
    let displayTimeList = [];
    for (let i = 0; i < this.objects.length; i++){
        displayTimeList.push(this.objects[i].displayTime*1000);
    }
    return gcdList(displayTimeList);
}

Project.prototype.upObject = function (index) {
    const s_object = this.objects[index];
    this.objects[index] = this.objects[index - 1];
    this.objects[index - 1] = s_object;
}

Project.prototype.downObject = function (index) {
    const s_object = this.objects[index];
    this.objects[index] = this.objects[index + 1];
    this.objects[index + 1] = s_object;
}

Project.prototype.previewImage = function (index) {
    $('#animePreview').width($('.movie-preview-canvas').width());
    $('#animePreview').attr('src', this.objects[index].image.src);
}

Project.prototype.reflash = function () {
    $('#movieObjectList').empty();
    for (let i = 0; i < this.objects.length; i++) {
        let div_data = document.createElement('div');
        div_data.className = 'movie-pj-contents';

        let label_data = document.createElement('div');
        label_data.className = 'movie-pj-label';
        label_data.textContent = this.objects[i].name;
        div_data.appendChild(label_data);

        let input_data = document.createElement('input');
        input_data.type = 'number';
        input_data.value = this.objects[i].displayTime;
        input_data.min = '0.1';
        input_data.step = '0.1';
        input_data.id = 'displayTime_' + i;
        input_data.className = 'movie-pj-num';
        input_data.addEventListener('change', function (e) {
            let index = parseInt(e.target.id.split('_')[1]);
            let obj = project.getObject(index);
            obj.updateDisplayTime(e.target.value);
            project.updateObject(index, obj);
        }, false);
        div_data.appendChild(input_data);

        label_unit = document.createElement('div');
        label_unit.className = 'movie-pj-label-unit';
        label_unit.textContent = "s";
        div_data.appendChild(label_unit);

        let preview_btn = document.createElement('label');
        preview_btn.className = 'pjobj-btn';
        preview_btn.id = 'preview_' + i;
        preview_btn.textContent = '👁';
        preview_btn.addEventListener('click', function (e) {
            let index = parseInt(e.target.id.split('_')[1]);
            project.previewImage(index);
        }, false);
        div_data.appendChild(preview_btn);

        let remove_btn = document.createElement('label');
        remove_btn.className = 'del-pjobj-btn';
        remove_btn.textContent = '-'
        remove_btn.id = 'remove_' + i;
        remove_btn.addEventListener('click', function (e) {
            project.removeObject(parseInt(e.target.id.split('_')[1]));
            project.reflash();
        }, false);
        div_data.appendChild(remove_btn);

        let up_btn = document.createElement('label');
        up_btn.className = 'updown-pjobj-btn';
        up_btn.textContent = '▲'
        up_btn.id = 'up_' + i;
        up_btn.addEventListener('click', function (e) {
            let index = parseInt(e.target.id.split('_')[1]);
            if (index == 0) return;
            let obj1 = project.getObject(index);
            let obj2 = project.getObject(index - 1);
            project.updateObject(index-1,obj1);
            project.updateObject(index,obj2);
            project.reflash();
        }, false);
        div_data.appendChild(up_btn);

        let down_btn = document.createElement('label');
        down_btn.className = 'updown-pjobj-btn';
        down_btn.textContent = '▼'
        down_btn.id = 'down_' + i;
        down_btn.addEventListener('click', function (e) {
            let index = parseInt(e.target.id.split('_')[1]);
            if (index + 1 == project.objects.length) return;
            let obj1 = project.getObject(index);
            let obj2 = project.getObject(index + 1);

            project.updateObject(index,obj2);
            project.updateObject(index+1,obj1);
            project.reflash();
        }, false);
        div_data.appendChild(down_btn);

        $('#movieObjectList').append(div_data);
    }
}

Project.prototype.create = function () {
    if (this.objects.length == 0) return;

    // Canvas Setting
    let tempCanvas = document.getElementById('tempCanvas');
    let ctx = tempCanvas.getContext('2d');
    tempCanvas.width = $('#movieWidth').val();
    tempCanvas.height = $('#movieHeight').val();

    // Encoder Init
    this.encoder = new GIFEncoder();
    this.encoder.setRepeat(0);
    let delayTime = this.getDisplayTimeMsecGcd();
    this.encoder.setDelay(delayTime);

    // Encode start.
    this.encoder.start();

    // Add Image
    for (let i = 0; i < this.objects.length; i++){
        let loop = this.objects[i].displayTime * 1000 / delayTime;
        for (let j = 0; j < loop; j++){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(this.objects[i].image, 0, 0, tempCanvas.width, tempCanvas.height);
            this.encoder.addFrame(ctx);
        }
    }

    // Encode end
    this.encoder.finish();
}

Project.prototype.getAnimeSrc = function () {
    return 'data:image/gif;base64,' + encode64(this.encoder.stream().getData());
}

Project.prototype.download = function () {
    if (this.encoder == null) return;
    this.encoder.download($('#gifName').val()+".gif");
}

function ProjectObject(name, image, displayTime) {
    this.name = name;
    let img = new Image();
    img.src = image;
    this.image = img;
    this.displayTime = displayTime;
}

ProjectObject.prototype.updateDisplayTime = function (value) {
    this.displayTime = value;
}

$('#animationPreview').click(function () {
    project.create();
    $('#animePreview').width($('.movie-preview-canvas').width() > $('#movieWidth').val() ? $('#movieWidth').val() : $('.movie-preview-canvas').width());
    $('#animePreview').attr('src', project.getAnimeSrc());
});

$('#downloadBtn').click(function () {
    project.download();
});
