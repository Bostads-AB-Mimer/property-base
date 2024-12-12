import request from 'supertest'
import app from '../app'

// Import test suites
import './hateoas/forward-navigation.test'
import './hateoas/backward-navigation.test'
import './hateoas/components-navigation.test'
