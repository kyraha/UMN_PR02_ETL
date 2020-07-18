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
    # return "Hello World!<br/><a href=zeus>Zeus</a>"
    return render_template("index.html")


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

@app.route("/season/<year>")
def season(year):
    data = []

    sample = engine.execute(f"""
        select c.pts, c.season, c.W, c.L, c.GF, c.GA,
        c."#" as rank,
        m.real_name as club,
        s."Total Compensation" as totalComp,
        s."Base Salary" as salary
        from seasons c
        join club_map m on m.long_name = c.Club
        join salaries s on s."Club (grouped)" = m.short_name
        where c.season = s.Season
        and c.season = ?
    """, year)

    for row in sample:
        record = {}
        for k, v in zip(sample.keys(), row):
            record[k] = v
        data.append(record)
    
    return jsonify(data)

# club = "2018; drop table blah;"

@app.route("/slice/<year>/<club>")
def season_club(year, club):
    data = []

    sample = engine.execute(f"""
        select c.pts, c.season, c.W, c.L, c.GF, c.GA,
        m.real_name as club,
        s."Total Compensation" as totalComp,
        s."Base Salary" as salary
        from seasons c
        join club_map m on m.long_name = c.Club
        join salaries s on s."Club (grouped)" = m.short_name
        where c.season = s.Season
        and c.season = ?
        and m.real_name = ?
    """, year, club)

    for row in sample:
        record = {}
        for k, v in zip(sample.keys(), row):
            record[k] = v
        data.append(record)
    
    return jsonify(data)

@app.route("/clubs/<year>")
def clubs(year):
    data = []
    sample = engine.execute("""
        select c.pts, c.W, c.L, c.GF, c.GA, c.GD,
        c."#" as rank,
        m.real_name as club
        from seasons c
        join club_map m on m.long_name = c.Club
        and c.season = ?
    """, year)
    for row in sample:
        record = {}
        for k, v in zip(sample.keys(), row):
            record[k] = v
        data.append(record)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
