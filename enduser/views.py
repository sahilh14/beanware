import json
from copy import deepcopy
from pymongo import MongoClient

from rest_framework import status
from django.conf import settings
from bson.objectid import ObjectId
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

EVENT_TYPES = {
    'slack': 'slack channel mention',
    'jira': 'jira ticket'
}


class EndUser(APIView):

    def update_document(self, query_params, request_body):
        if query_params['type'] == EVENT_TYPES['slack']:
            collection = settings.DB['slack_event']
        elif query_params['type'] == EVENT_TYPES['jira']:
            collection = settings.DB['jira_event']
        user = query_params['user']

        collection.update({'_id': ObjectId(query_params['id'])}, {'$set': {'read_status.%s' % user : True}})

    def get_slack_events(self, user):
        slack_collection = settings.DB['slack_event']
        data = slack_collection.find({
            'mention_ids': {
                '$in': [user]
                }
            })
        output = list()
        document = dict()

        for doc in data:
            document['desc'] = doc.get('full_text', None)
            document['title'] = doc.get('channel_id', None)
            document['sender_id'] = doc.get('sender_id', None)
            document['type'] = EVENT_TYPES['slack']
            document['id'] = str(doc['_id'])
            document['read_status'] = doc.get('read_status', {}).get(user, False)
            document['slack_account_id'] = doc.get('slack_account_id', None)
            document['slack_app_id'] = doc.get('slack_app_id', None)
            document['mention_ids'] = doc.get('mention_ids', None)
            output_doc = deepcopy(document)
            output.append(output_doc)
        return output

    def get_jira_events(self, user):
        jira_collection = settings.DB['jira_event']
        data = jira_collection.find({
            'assign_ids': {
                '$in': [user]
                }
            })
        output = list()
        document = dict()
        for doc in data:
            document['desc'] = doc.get('description', None)
            document['title'] = doc.get('title', None)
            document['sender_id'] = doc.get('sender_id', None)
            document['type'] = EVENT_TYPES['jira']
            document['id'] = str(doc['_id'])
            document['read_status'] = doc.get('read_status', {}).get(user, False)
            document['jira_account_id'] = doc.get('jira_account_id', None)
            document['issue_id'] = doc.get('issue_id', None)
            document['project_id'] = doc.get('project_id', None)
            document['extra_data'] = doc.get('extra_data', None)
            document['assign_ids'] = doc.get('assign_ids', None)
            output_doc = deepcopy(document)
            output.append(output_doc)
        return output

    def post_data(self, data, type):

        data['read_status'] = dict()

        if type == 'slack':
            collection = settings.DB['slack_event']
            for i in data['mention_ids']:
                data['read_status'][i] = False

        elif type == 'jira':
            collection = settings.DB['jira_event']
            for i in data['assign_ids']:
                data['read_status'][i] = False

        collection.insert(data)

    def get(self, request):
        user = request.query_params['user']

        slack_data = self.get_slack_events(user)
        jira_data = self.get_jira_events(user)
        output = slack_data + jira_data
        output.sort(key=lambda x:x['id'], reverse=True)

        return Response(output)

    def post(self, request):
        try:
            body = json.loads(request.data['data'])
            type = request.data['type']
            self.post_data(body, type)
        except Exception as e:
            return Response({'error': e.message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response("Created", status=status.HTTP_201_CREATED)

    def put(self, request):
        try:
            query_params = request.query_params
            request_body = json.loads(request.body)
            self.update_document(query_params, request_body)
        except Exception as e:
            return Response({'error': e.message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response('Updated')


class PollDB(APIView):

    def get(self, request):
        event_count = int(request.query_params['count'])
        user = request.query_params['user']

        slack_collection = settings.DB['slack_event']
        num_slack_events = slack_collection.find({
            'mention_ids': {
                '$in': [user]
                }
            }).count()

        jira_collection = settings.DB['jira_event']
        num_jira_events = jira_collection.find({
            'assign_ids': {
                '$in': [user]
                }
            }).count()
        if num_jira_events + num_slack_events > event_count:
            return Response('Success')

        return Response('Failure')
