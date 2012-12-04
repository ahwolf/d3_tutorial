import csv
import json

election_data = csv.reader(open("../web/data/elections.csv"), delimiter = '|')

checker = {}
for row in election_data:

    if row[3] == 'B. Obama (i)':
        checker[row[1].strip()] = row[5].strip('%')

checker['Autugua'] = checker['Autauga']

f = open('../web/data/us-counties.json','r')
json_data = json.load(f)
f.close()
features = json_data['features']

for county in features:
    try:
        county['properties']['percent'] = checker[county['properties']['name']]
    except KeyError:
        county['properties']['percent'] = '50'



f = open('../web/data/election.json','w')

json.dump(json_data, f)


        

