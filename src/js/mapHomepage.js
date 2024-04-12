(function(){
    const lat = -31.4159171;
    const lng = -64.4894222;
    const map = L.map('map-homepage').setView([lat, lng ], 16);

    let markers = new L.FeatureGroup().addTo(map)

    let properties = []

    //filters
    const filters = {
        category: '',
        price: ''
    }

    const categoriesSelect = document.querySelector('#categories')
    const pricesSelect = document.querySelector('#prices')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Category aand Price filter
    categoriesSelect.addEventListener('change', e => {
        filters.category = +e.target.value
        filterProperties()
    })
    pricesSelect.addEventListener('change', e => {
        filters.price = +e.target.value
        filterProperties()
    })

    const getProperties = async () => {

        try {
            
            const url = '/api/properties'
            const response = await fetch(url)
            properties = await response.json()

            showProperties(properties)

        } catch (error) {
            console.log(error)
        }

    }

    const showProperties = properties => {
        
        //clean previous markers
        markers.clearLayers()

        properties.forEach(property => {
            //)
            //add pin
            const marker = new L.marker([property?.lat, property?.lng ], {
                autoPan: true
            })
            .addTo(map)
            .bindPopup(`
                <h1 class="text-l font-extrabold uppercase my-5">${property?.title}</h1>
                <img src="/uploads/${property?.images}" alt="${property.title}">
                <p class=" text-gray-600 font-bold">${property.price.name}</p>
                <a href="/property/${property.id}" class="bg-red-800 block text-center uppercase rounded py-2 px-2"> View property</a>
            `)

            markers.addLayer(marker)
        })

    }

    const filterProperties = () => {
        //console.log(properties)
        const result = properties.filter(filterCategory).filter(filterPrice)

        //const resultFilterCategory = properties.filter( filterCategory)
        //const resultFilterPrice = properties.filter( filterPrice)

        showProperties(result)

    }

    const filterCategory =  property => filters.category ? property.categoryID === filters.category : property
    const filterPrice =  property => filters.price ? property.priceID === filters.price : property

    getProperties()

})()