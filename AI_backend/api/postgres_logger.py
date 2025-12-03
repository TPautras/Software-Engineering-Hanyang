import psycopg2
import os

def log_prediction(seq, e, se):
    conn = psycopg2.connect(os.getenv("POSTGRES_URI"))
    cur = conn.cursor()
    cur.execute("INSERT INTO predictions(sequence,effect,side_effect) VALUES (%s,%s,%s)", (str(seq), e, se))
    conn.commit()
    cur.close()
    conn.close()
