import app from '../src/app';
import { getRoutes } from '../src/utils/route-utils';
import express from 'express';

console.log('Registered Routes:');
const routes = getRoutes(app as express.Application);
console.log(JSON.stringify(routes, null, 2));
