import pandas as pd

import sqlite3

# connect to db
conn= sqlite3.connect('ufo_db.sqlite')


# read the csv data into a dataframe
df = pd.read_csv('ufo.csv')



# send it to the database (replace 'passenger' with your table name and 'id' with your primary key column)
df.to_sql('ufo', conn, index=False, if_exists='replace', dtype={'ID': 'INTEGER PRIMARY KEY'})
conn.close()

