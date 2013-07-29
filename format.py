'''
This script transforms our dictionary to JSON formatting.
The current parsing is just for POC purposes and skips many definitions.
'''

import re
import json

def clean(word):
	return re.sub('[\[\{\(][\w\.]+[\}\]\)]','',word).strip().lower()


dictionary = file('de-en.txt').read().splitlines()
output = {}
for line in dictionary:
	if line[0] == '#':
		continue

	split = line.split('::')
	
	german = clean(split[0].split(';')[0].split('|')[0])
	english = split[1].split(';')

	output[german] = english

file('dict.json','w').write(json.dumps(output))
