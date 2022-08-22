import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Toggl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toggl',
		name: 'Toggl',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		icon: 'file:togglLogo.svg',
		description: 'Toggl API node',
		defaults: {
			name: 'Toggl',
			color: '#742cd4',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Authenticate and Get User Data',
						value: 'authenticateAndGetUserData',
						description: "Authenticate with Toggl and get the user's data",
					},
					{
						name: 'Clients',
						value: 'clients',
						description: 'TBU',
					},
					{
						name: 'Dashboard',
						value: 'dashboard',
						description: 'TBU',
					},
					{
						name: 'Groups',
						value: 'groups',
						description: 'TBU',
					},
					{
						name: 'Project Users',
						value: 'projectUsers',
						description: 'TBU',
					},
					{
						name: 'Projects',
						value: 'projects',
						description: 'TBU',
					},
					{
						name: 'Tags',
						value: 'tags',
						description: 'TBU',
					},
					{
						name: 'Tasks',
						value: 'tasks',
						description: 'TBU',
					},
					{
						name: 'Time Entries',
						value: 'timeEntries',
						description: 'TBU',
					},
					{
						name: 'Users',
						value: 'users',
						description: 'TBU',
					},
					{
						name: 'Workspace Users',
						value: 'workspaceUsers',
						description: 'TBU',
					},
					{
						name: 'Workspaces',
						value: 'workspaces',
						description: 'TBU',
					},
				],
				default: 'authenticateAndGetUserData',
				required: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['authenticateAndGetUserData'],
					},
				},
				options: [
					{
						name: 'HTTP Basic Auth with E-Mail and Password',
						value: 'basicAuthMail',
						action: 'Http basic auth with email and password an authenticate and get user data',
					},
					{
						name: 'HTTP Basic Auth with API Token',
						value: 'basicAuthToken',
						action: 'Http basic auth with api token an authenticate and get user data',
					},
					{
						name: 'Authentication with a Session Cookie',
						value: 'cookie',
						action: 'Authentication with a session cookie',
					},
					{
						name: 'Destroy the Session',
						value: 'destroySession',
						action: 'Destroy the session',
					},
				],
				default: 'basicAuthToken',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let myString: string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				myString = this.getNodeParameter('myString', itemIndex, '') as string;
				item = items[itemIndex];

				item.json['myString'] = myString;
			} catch (error) {
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}
}
