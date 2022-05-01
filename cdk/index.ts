#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {MainStack} from './stack.main';
import * as dotenv from 'dotenv';

dotenv.config();
const app = new cdk.App();
new MainStack(app, 'NvgGuildStack', {
    stackName: `${process.env.UNIQUE_SUFFIX}-guild`
});