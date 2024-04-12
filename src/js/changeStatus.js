(function () {
    //alert('changeStatus.js')

    const changeStatusButton = document.querySelectorAll('.change-status')
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    changeStatusButton.forEach(button => {
        button.addEventListener('click', changeStatusPtoperty)
    })

    async function changeStatusPtoperty(e) {
        
        const { propertyId: id } = e.target.dataset
        
        try {
            
            const url = `/properties/${id}`
        
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token
                }
            })

            const { result } = await response.json()

            if (result) {
                if (e.target.classList.contains('bg-gray-300')) {
                    e.target.classList.add('bg-gray-100', 'hover:bg-gray-300')
                    e.target.classList.remove('bg-gray-300', 'hover:bg-gray-100')
                    e.target.textContent = 'Published'
                } else {
                    e.target.classList.remove('bg-gray-100', 'hover:bg-gray-300')
                    e.target.classList.add('bg-gray-300', 'hover:bg-gray-100')
                    e.target.textContent = 'No Published'
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

})()