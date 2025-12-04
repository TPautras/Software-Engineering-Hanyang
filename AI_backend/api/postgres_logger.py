import psycopg2

def log_prediction(seq, effect, side):
    conn = psycopg2.connect(
        dbname="drugdb",
        user="admin",
        password="admin",
        host="postgres",
        port=5432
    )
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO predictions (sequence, effect, side_effect) VALUES (%s, %s, %s)",
        (str(seq), effect, side)
    )
    conn.commit()
    cur.close()
    conn.close()
