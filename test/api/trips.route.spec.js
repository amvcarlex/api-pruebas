const request = require('supertest')
const app = require('./../../app')
const mongoose = require('mongoose')
const Trip = require('./../../models/trip.model')
describe('pruebas sobre las apis de trips', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://admin2022:a9pNE4sGQFNKJgsO@cluster01.y9wjnao.mongodb.net/dbUnc?retryWrites=true&w=majority')
    })
    afterAll(async () => {
        await mongoose.disconnect()
    })

    describe('GET /api/trips', () => {
        let response
        beforeEach(async () => {
            response = await request(app).get('/api/trips').send()
        })

        it('La ruta funciona', async () => {
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toContain('json')
        })

        it('La petición nos devuelve un array de trips', async () => {
            expect(response.body).toBeInstanceOf(Array)
        })
    })

    describe('POST /api/trips', () => {
        const newTrip = { name: 'test-trimp', destination: 'berlin', category: 'familiar', start_date: '2022-06-20' }
        const wnewTrip = { name: 'test-trimp', category: 'familiar', start_date: '2022-06-20' }
        afterAll(async () => {
            await Trip.deleteMany({ name: 'test-trimp' })
        })

        it('La ruta funcione', async () => {
            const response = await request(app).post('/api/trips').send(newTrip)

            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toContain('json')
        })

        it('Se inserta correctamente', async () => {
            const response = await request(app).post('/api/trips').send(newTrip)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe(newTrip.name)
        })

        it('Error al crear un trip', async () => {
            const response = await request(app).post('/api/trips').send(wnewTrip)

            expect(response.status).toBe(500)
            expect(response.body.error).toBeDefined()
        })
    })

    describe('PUT /api/trips', () => {
        let trip
        beforeEach(async () => {
            trip = await Trip.create({ name: 'test trip', destination: 'berlin', category: 'amigos', start_date: '2022-06-20' })
        })
        afterEach(async () => {
            await Trip.findByIdAndDelete(trip._id)
        })

        it('La ruta funciona', async () => {
            const response = await request(app).put(`/api/trips/${trip._id}`).send({ name: 'trip cambiado' })

            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toContain('json')
        })

        it('Se actualiza correctamente', async () => {
            const response = await request(app).put(`/api/trips/${trip._id}`).send({ name: 'trip cambiado' })

            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('trip cambiado')
        })

    })

    describe('DELETE /api/trips', () => {

        let trip
        let response
        beforeEach(async () => {
            trip = await Trip.create({ name: 'test trip delete', destination: 'berlin', category: 'amigos', start_date: '2022-06-20' })
            response = await request(app).delete(`/api/trips/${trip._id}`).send()
        })

        it('La ruta funciona', () => {
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toContain('json')
        })

        it('Elimina correctamente', async ()=>{
            expect(response.body._id).toBeDefined()
            const foundTrip = await Trip.findById(trip._id)
            expect(foundTrip).toBeNull()
        })
    })
})