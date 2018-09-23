import csv
import requests
from bs4 import BeautifulSoup

url = 'https://www.basketball-reference.com/leagues/NBA_2018_advanced.html'
response = requests.get(url)
html = response.content

soup = BeautifulSoup(html, "html.parser")
table = soup.find('tbody')

list_of_rows = []
for row in table.findAll('tr'):
	list_of_cells = []
	for cell in row.findAll('td'):
		text = cell.text
		list_of_cells.append(text)
	list_of_rows.append(list_of_cells)

clean_list_of_rows = filter(None, list_of_rows)

outfile = open("./players.csv", "w", newline='')
writer = csv.writer(outfile)
writer.writerow(["Player", "Pos", "Age", "Tm", "G", "MP", "PER", "TS%", "3PAr%", "FTr", "ORB%", "DRB%", "TRB%", "AST%", "STL%", "BLK%", "TOV%", "USG%", "OWS", "DWS", "WS", "WS/48", "OBPM", "DBPM", "BPM", "VORP"])
writer.writerows(clean_list_of_rows)