// src/mocks/handlers.js
import {rest} from 'msw'
import {HOST} from '../host'
import {dummyCode} from './dummy'

export const handlers = [
  rest.get(HOST + '/list', (req, res, ctx) => {
    // Persist user's authentication in the session
    // sessionStorage.setItem('is-authenticated', 'true')

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json([
        {
          pm_id: 'prj-1',
          pm2_env: {
            args: ['key', 'value', 'key2', 'value2'],
            exit_code: null,
            status: 'inline',
            pm_uptime: 20,
            created_at: '2022-10-23T12:00:00.000Z',
          },
          name: 'Dummy Project',
        },
      ]),
    )
  }),
  rest.get(HOST + '/draft', (req, res, ctx) => {
    // Persist user's authentication in the session
    // sessionStorage.setItem('is-authenticated', 'true')

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        step: 0,
      }),
    )
  }),

  rest.post('/login', (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem('is-authenticated', 'true')

    return res(
      // Respond with a 200 status code
      ctx.status(200),
    )
  }),
  rest.get(HOST + '/code/:projName', (req, res, ctx) => {
    // Persist user's authentication in the session
    // sessionStorage.setItem('is-authenticated', 'true')

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        code: dummyCode,
      }),
    )
  }),

  rest.post(HOST + '/login', (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem('is-authenticated', 'true')

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        token: 'dummyToken',
      }),
    )
  }),

  rest.get('/user', (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const isAuthenticated = sessionStorage.getItem('is-authenticated')

    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        }),
      )
    }

    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        username: 'admin',
      }),
    )
  }),
]
