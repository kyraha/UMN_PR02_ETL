from flask import Flask, render_template, redirect, jsonify

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect
import pandas as pd

engine = create_engine("sqlite:///../ETL_KD/Resources/mlsseasons.sqlite", echo=False)

app = Flask(__name__)

# Route to render index.html template using data from Mongo
@app.route("/")
def home():
    # Return template and data
    return "Hello World!"


# Route that will trigger the scrape function
@app.route("/zeus")
def zeus():

    data = []

    sample = engine.execute("""
        select s."First Name", s."Last Name",
        c.Club, c.pts, c.season
        from seasons c
        join club_map m on m.long_name = c.Club
        join salaries s on s."Club (grouped)" = m.short_name
        where c.season = s.Season
    """)

    for row in sample:
        record = {}
        for k, v in zip(sample.keys(), row):
            record[k] = v
        data.append(record)
    
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
