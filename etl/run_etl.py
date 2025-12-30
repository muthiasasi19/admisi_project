from extract import extract_table

if __name__ == "__main__":
    query = """
    SELECT TOP 10 *
    FROM dbo.camaru_parent
    """

    df = extract_table(query)
    print(df.head())
    print("Rows:", len(df))

df['provinsi_final'] = resolve_province(
    prov_parent=df['Nama_Provinsi_parent'],
    prov_camaru=df['Provinsi_camaru'],
    prov_from_school=df['Provinsi_AsalSekolah'],
    prov_from_birthplace=df['Provinsi_TempatLahir']
)
