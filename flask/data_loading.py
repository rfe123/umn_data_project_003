import pandas as pd

import sqlite3

# connect to db
conn = sqlite3.connect('parks_db_1.sqlite')


# read the csv data into a dataframe
df = pd.read_csv('parks_info.csv')

# send it to the database (replace 'passenger' with your table name and 'id' with your primary key column)
df.to_sql('cities', conn, index=False, if_exists='replace', dtype={'id': 'INTEGER PRIMARY KEY'})
conn.close()
