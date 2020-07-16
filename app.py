from flask import Flask, render_template, redirect, jsonify

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect
import pandas as pd

engine = create_engine("sqlite:///ETL_KD/Resources/mlsseasons.sqlite", echo=False)

app = Flask(__name__)

# Route to render index.html template using data from Mongo
@app.route("/")
def home():
    # Return template and data
    return "Hello World!<br/><a href=zeus>Zeus</a>"


# Route that will trigger the scrape function
@app.route("/zeus")
def zeus():

    data = []

    sample = engine.execute("""
        select --s."First Name" as firstName, s."Last Name" as lastName,
        c.Club, c.pts, c.season, c.W, c.L, c.GF, c.GA,
        avg(s."Total Compensation") as totalCompensation,
        avg(s."Base Salary") as baseSalary
        from seasons c
        join club_map m on m.long_name = c.Club
        join salaries s on s."Club (grouped)" = m.short_name
        where c.season = s.Season
        group by c.Club, c.pts, c.season, c.W, c.L, c.GF, c.GA
    """)

    for row in sample:
        record = {}
        for k, v in zip(sample.keys(), row):
            record[k] = v
        data.append(record)
    
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
