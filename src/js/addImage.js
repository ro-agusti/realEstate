import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.images = {
    dictDefaultMessage: 'Drop images here to upload',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks : true,
    dictRemoveFile: 'Delete file',
    dictMaxFilesExceeded: 'Only 1 file can be uploaded',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'images',
    init: function() {
        const dropezone = this
        const btnPublish = document.querySelector('#publish')
        btnPublish.addEventListener('click', function(){
            dropezone.processQueue()
        })
        dropezone.on('queuecomplete', function() {
            if(dropezone.getActiveFiles().length == 0) {
                window.location.href = '/my-properties'
            }
        })
    }
}