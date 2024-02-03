import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///combined_db.sqlite")

# Reflect the database tables explicitly
Base = automap_base()
Base.prepare(autoload_with=engine, reflect=True)

# Save reference to the table
print(Base.classes.keys())
Ufo = Base.classes.ufo  # Ensure "ufo" matches the actual table name in your database
Cities = Base.classes.cities

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/api/data/<column_name>", methods=['GET'])
def get_data_by_column(column_name):
    # create session (link from Python to db)
    session = Session(engine)

    # query the desired column
    results = list(session.query(getattr(Ufo, column_name)))

    # close the session
    session.close()

    # Convert list of tuples into normal list
    all_values = list(np.ravel(results))
    response = jsonify([str(a) for a in all_values])

    # https://stackoverflow.com/questions/26980713/solve-cross-origin-resource-sharing-with-flask
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/api/all_data/ufo", methods=['GET'])
def get_ufo():
    # create session (link from python to db)
    session = Session(engine)

    # query the desired column
    results = list(session.query(Ufo).all())

    # close the session
    session.close()
          # Serialize the users into a list of dictionaries
    ufo_list = []
    for ufo in results:
        ufo_dict = {}
        for column in Ufo.__table__.columns:
            ufo_dict[column.name] = getattr(ufo, column.name)
        ufo_list.append(ufo_dict)

    # Return the JSON list
    response = jsonify(ufo_list)

    # https://stackoverflow.com/questions/26980713/solve-cross-origin-resource-sharing-with-flask
    response.headers.add('Access-Control-Allow-Origin', '*')

    # Return the JSON dictionary
    return response


@app.route("/api/all_data/parks", methods=['GET'])
def get_cities():
    # create session (link from python to db)
    session = Session(engine)

    # query the desired column
    results = list(session.query(Cities).all())

    # close the session
    session.close()

    city_list = []
    for city in results:
        city_dict = {}
        for column in Cities.__table__.columns:
            city_dict[column.name] = getattr(city, column.name)
        city_list.append(city_dict)

    # Return the JSON list
    response = jsonify(city_list)
    
        # https://stackoverflow.com/questions/26980713/solve-cross-origin-resource-sharing-with-flask
    response.headers.add('Access-Control-Allow-Origin', '*')

    # Return the JSON dictionary
    return response
    
# run the app!
if __name__ == '__main__':
    app.run(port=8080)
