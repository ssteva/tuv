
IF EXISTS(SELECT 1 FROM sys.columns c WHERE c.name='VrednostPonude' AND Object_ID = Object_ID(N'dbo.tPonuda'))
	ALTER TABLE tPonuda DROP COLUMN VrednostPonude

IF object_id('VrednostPonude') IS NOT NULL BEGIN
	DROP FUNCTION VrednostPonude
END
GO


CREATE  function [dbo].VrednostPonude
(
	@PonudaId INT
)
returns  DECIMAL(18,2)
as
begin
	DECLARE @rez DECIMAL(18,2)

	SELECT @rez = sum(ps.Kolicina * ps.Cena) 
	FROM tPonuda p
	INNER JOIN tPonudaStavka ps ON p.Id = ps.PonudaId
	WHERE ps.Obrisan = 0
	AND p.Id = @PonudaId
	RETURN ISNULL(@rez,0)
END

GO
ALTER TABLE tPonuda ADD VrednostPonude AS dbo.VrednostPonude(Id)

GO















--IF EXISTS(SELECT 1 FROM sys.columns c WHERE c.name='VrednostKlijentRsd' AND Object_ID = Object_ID(N'dbo.tKlijent'))
--	ALTER TABLE tKlijent DROP COLUMN VrednostKlijentRsd
--IF EXISTS(SELECT 1 FROM sys.columns c WHERE c.name='VrednostKlijentEur' AND Object_ID = Object_ID(N'dbo.tKlijent'))
--	ALTER TABLE tKlijent DROP COLUMN VrednostKlijentEur
--GO

--IF object_id('VrednostKlijent') IS NOT NULL BEGIN
--	DROP FUNCTION VrednostKlijent
--END
--GO
--CREATE  function [dbo].VrednostKlijent
--(
--	@KlijentId INT,
--	@Valuta NVARCHAR(3)
--)
--returns int
--as
--begin
--	DECLARE @rez DECIMAL(18,2)

--	SELECT @rez = sum(ps.Kolicina * ps.Cena) 
--	FROM tPonuda p
--	INNER JOIN tPonudaStavka ps ON p.Id = ps.PonudaId
--	WHERE ps.Obrisan = 0
--	AND p.KlijentId = @KlijentId
--	AND p.Valuta = @Valuta

--	RETURN @rez
--END

--GO
--ALTER TABLE tKlijent ADD VrednostKlijentRsd AS dbo.VrednostKlijent(Id, N'RSD')
--ALTER TABLE tKlijent ADD VrednostKlijentEur AS dbo.VrednostKlijent(Id, N'EUR')

--GO




IF EXISTS(SELECT 1 FROM sys.columns c WHERE c.name='Vrednost' AND Object_ID = Object_ID(N'dbo.tPonudaStavka'))
	ALTER TABLE tPonudaStavka DROP COLUMN Vrednost

IF object_id('Vrednost') IS NOT NULL BEGIN
	DROP FUNCTION Vrednost
END
GO
CREATE  function [dbo].Vrednost
(
	@PonudaStavkaId INT
)
returns  DECIMAL(18,2)
as
begin
	DECLARE @rez DECIMAL(18,2)

	SELECT @rez = sum(ps.Kolicina * ps.Cena) 
	FROM tPonudaStavka ps
	WHERE ps.Id = @PonudaStavkaId
	RETURN @rez
END

GO
ALTER TABLE tPonudaStavka ADD Vrednost AS dbo.Vrednost(Id)

GO


IF EXISTS(SELECT 1 FROM sys.procedures p WHERE p.name='PregledPonuda')
	DROP PROCEDURE PregledPonuda
GO

CREATE PROCEDURE PregledPonuda
	@count BIT = NULL,
	@take INT = 10,
	@skip INT = 0,
	@sortfield VARCHAR(100) = 'Id',
	@sortdir VARCHAR(4) = 'DESC',
	@broj NVARCHAR(50),
	@datumPonude DATE,
	@datumVazenja DATE
AS
DECLARE @statement NVARCHAR(3000)
IF @count IS NULL
	SET @count = 0

IF @count = 0 BEGIN
	SELECT P.Id, p.Rbr, p.Broj, k.Naziv, p.DatumPonude, p.DatumVazenja, P.VrednostPonude
	FROM tPonuda p
	INNER JOIN tKlijent k ON p.KlijentId = k.Id
	WHERE p.Obrisan = 0
END

IF @count = 1 BEGIN
	SELECT COUNT(*)
	FROM tPonuda p 
	WHERE p.Obrisan = 0
END

GO





IF EXISTS(SELECT 1 FROM sys.columns c WHERE c.name='PotrebnoOdobrenjeDirektora' AND Object_ID = Object_ID(N'dbo.tPonuda'))
	ALTER TABLE tPonuda DROP COLUMN PotrebnoOdobrenjeDirektora

IF object_id('PotrebnoOdobrenjeDirektora') IS NOT NULL BEGIN
	DROP FUNCTION PotrebnoOdobrenjeDirektora
END
GO
CREATE  function [dbo].PotrebnoOdobrenjeDirektora
(
	@PonudaId INT
)
returns BIT
as
begin
	DECLARE @rez BIT
	DECLARE @suma DECIMAL(18,2)
	DECLARE @limit int
	
	SELECT @suma = 
		CASE WHEN p.Valuta='EUR' THEN sum(ps.Kolicina * ps.Cena) 
			WHEN P.Valuta='RSD' THEN SUM(ps.Kolicina * (ps.Cena / ps.Kurs)) 
		END
	,@limit = MAX(p.LimitOdobrenjaDirektora)
	FROM tPonudaStavka ps
	INNER JOIN tPonuda p ON ps.PonudaId = p.Id
	WHERE ps.PonudaId = @PonudaId
	GROUP BY p.Valuta
	IF @suma> @limit
		SELECT @rez = CONVERT(BIT, 1)
	ELSE
		SELECT @rez = CONVERT(BIT, 0)
	RETURN @rez
END

GO
ALTER TABLE tPonuda ADD PotrebnoOdobrenjeDirektora AS dbo.PotrebnoOdobrenjeDirektora(Id)

GO





IF EXISTS(SELECT 1 FROM sys.columns c WHERE c.name='StatusPonude' AND Object_ID = Object_ID(N'dbo.tPonuda')) BEGIN
	--DECLARE @ime NVARCHAR(128)
	--SELECT
 --   @ime = CONVERT(NVARCHAR(128), C.CONSTRAINT_NAME)
	--FROM
	--	INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS C
	--INNER JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS FK
	--	ON C.CONSTRAINT_NAME = FK.CONSTRAINT_NAME
	--INNER JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS PK
	--	ON C.UNIQUE_CONSTRAINT_NAME = PK.CONSTRAINT_NAME
	--INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE CU
	--	ON C.CONSTRAINT_NAME = CU.CONSTRAINT_NAME
	--INNER JOIN (
	--			SELECT
	--				i1.TABLE_NAME,
	--				i2.COLUMN_NAME
	--			FROM
	--				INFORMATION_SCHEMA.TABLE_CONSTRAINTS i1
	--			INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE i2
	--				ON i1.CONSTRAINT_NAME = i2.CONSTRAINT_NAME
	--			WHERE
	--				i1.CONSTRAINT_TYPE = 'PRIMARY KEY'
	--		   ) PT
	--	ON PT.TABLE_NAME = PK.table_name
	--WHERE PK.TABLE_NAME='tPonudaStatus'


	--DECLARE @statement  NVARCHAR(3000) =''
	--SELECT @statement = @statement + 'ALTER TABLE tPonuda DROP CONSTRAINT ' + @ime +';'
	--EXEC sys.sp_executesql @statement
	ALTER TABLE tPonuda DROP CONSTRAINT FK_StatusPonude

	ALTER TABLE tPonuda DROP COLUMN StatusPonude
END
IF object_id('StatusPonude') IS NOT NULL BEGIN
	DROP FUNCTION StatusPonude
END
GO


CREATE  function [dbo].StatusPonude
(
	@PonudaId INT
)
returns INT
--WITH SCHEMABINDING
as
begin
	DECLARE @rez INT
	DECLARE @status INT
	DECLARE @potrebnoOdobrenjeDirektora BIT
	DECLARE @odobrenaR BIT
	DECLARE @odobrenaD BIT
	DECLARE @prihvacena BIT
	DECLARE @limt INT
	SELECT @limt = p.Vredpar1 FROM dbo.tParametri p WHERE p.Vrsta='LimitOdobrenjaDirektora'
	SELECT @status = p.Status, @potrebnoOdobrenjeDirektora = 
		CASE WHEN p.Valuta = 'EUR' AND SUM(ps.Kolicina * ps.Cena) >= @limt THEN 1
			 --WHEN p.Valuta = 'EUR' AND (SELECT SUM(ps.Kolicina * ps.Cena) FROM tPonudaStavka ps WHERE ps.Obrisan=0 AND ps.PonudaId = @PonudaId) < 10000 THEN 0
			 WHEN p.Valuta = 'EUR' AND SUM(ps.Kolicina * ps.Cena) < @limt THEN 0
			 WHEN p.Valuta = 'RSD' AND SUM(ps.Kolicina * ps.Cena) >= @limt THEN 1
			 WHEN p.Valuta = 'EUR' AND SUM(ps.Kolicina * ps.Cena) < @limt THEN 0
		END,
	@odobrenaR = ISNULL(p.OdobrenaR,0), @odobrenaD = ISNULL(p.OdobrenaD,0), @prihvacena = ISNULL(p.Prihvacena,0)
	FROM	 dbo.tPonuda p
	INNER JOIN dbo.tPonudaStavka ps ON p.Id = ps.PonudaId
	WHERE p.Id = @PonudaId
	AND ps.Obrisan=0
	GROUP BY P.Status, p.OdobrenaR, P.OdobrenaD, P.Prihvacena, P.Valuta

	--1 Èeka se odobrenje
	IF @status = 1 
		SET @rez = 1
	--2 Èeka se odobrenje direktora
	IF @status = 1 AND @potrebnoOdobrenjeDirektora = 1 AND @odobrenaR = 1
		SET @rez = 2
	--3 Potrebna dorada 
	IF @status = 2 AND @potrebnoOdobrenjeDirektora = 0 AND @odobrenaR = 0
		SET @rez = 3
	--4 Odobrena
	IF (@status = 2 AND @potrebnoOdobrenjeDirektora = 1 AND @odobrenaD = 1 AND @odobrenaR = 1) OR (@status = 2 AND @potrebnoOdobrenjeDirektora = 0 AND @odobrenaR = 1)
		SET @rez = 4
	--5 Prihvaæena ponuda
	IF @status = 3 AND @prihvacena = 1
		SET @rez = 5
	--6 Nije prihvaæena
	IF @status = 3 AND @prihvacena = 0
		SET @rez = 6
	RETURN @rez
END

GO
ALTER TABLE tPonuda ADD StatusPonude AS dbo.StatusPonude(Id) 


GO

SELECT 

--ALTER TABLE [dbo].[tPonuda]  WITH CHECK ADD  CONSTRAINT [FK_StatusPonude] FOREIGN KEY([StatusPonude])
--REFERENCES [dbo].[tPonudaStatus] ([Id])
--GO

--ALTER TABLE [dbo].[tPonuda] CHECK CONSTRAINT [FK_StatusPonude]
--GO









--IF EXISTS(SELECT 1 FROM sys.columns c WHERE c.name='Fakturisano' AND Object_ID = Object_ID(N'dbo.tRadniNalog'))
--	ALTER TABLE tRadniNalog DROP COLUMN Fakturisano

--IF object_id('Fakturisano') IS NOT NULL BEGIN
--	DROP FUNCTION Fakturisano
--END
--GO


--CREATE  function [dbo].Fakturisano
--(
--	@RadniNalogId INT
--)
--returns  DECIMAL(18,2)
--as
--begin
--	DECLARE @rez DECIMAL(18,2)

--	SELECT @rez = sum(f.Iznos) 
--	FROM tFaktura f
--	INNER JOIN tRadniNalog rn ON f.RadniNalogId = rn.Id
--	WHERE rn.Obrisan = 0
--	AND f.Obrisan = 0
--	AND rn.Id = @RadniNalogId
--	RETURN ISNULL(@rez,0)
--END

--GO
--ALTER TABLE tRadniNalog ADD Fakturisano AS dbo.Fakturisano(Id)

--GO







--IF EXISTS(SELECT 1 FROM sys.columns c WHERE c.name='Uplaceno' AND Object_ID = Object_ID(N'dbo.tRadniNalog'))
--	ALTER TABLE tRadniNalog DROP COLUMN Uplaceno

--IF object_id('Uplaceno') IS NOT NULL BEGIN
--	DROP FUNCTION Uplaceno
--END
--GO


--CREATE  function [dbo].Uplaceno
--(
--	@RadniNalogId INT
--)
--returns  DECIMAL(18,2)
--as
--begin
--	DECLARE @rez DECIMAL(18,2)

--	SELECT @rez = sum(U.Iznos) 
--	FROM tUplata u
--	INNER JOIN tRadniNalog rn ON u.RadniNalogId = rn.Id
--	WHERE rn.Obrisan = 0
--	AND u.Obrisan = 0
--	AND rn.Id = @RadniNalogId
--	RETURN ISNULL(@rez,0)
--END

--GO
--ALTER TABLE tRadniNalog ADD Uplaceno AS dbo.Uplaceno(Id)

--GO





















--IF EXISTS(SELECT 1 FROM sys.columns c WHERE c.name='StatusNaloga' AND Object_ID = Object_ID(N'dbo.tRadniNalog')) BEGIN

--	ALTER TABLE tRadniNalog DROP CONSTRAINT FK_StatusNaloga

--	ALTER TABLE tRadniNalog DROP COLUMN StatusNaloga
--END
--IF object_id('StatusNaloga') IS NOT NULL BEGIN
--	DROP FUNCTION StatusNaloga
--END
--GO


--CREATE  function [dbo].StatusNaloga
--(
--	@nalogid INT
--)
--returns INT
----WITH SCHEMABINDING
--as
--begin
--	DECLARE @rez INT
--	DECLARE @status INT
--	DECLARE @fakturisano DECIMAL (12,2)
--	DECLARE @uplaceno DECIMAL (12,2)
	
--	SELECT @status = rn.Status, @fakturisano = rn.Fakturisano, @uplaceno = rn.Uplaceno
--	FROM tRadniNalog rn WHERE rn.Id = @nalogid

--	--1 Otvoren
--	IF @status = 1 
--		SET @rez = 1
--	--2 Nefakturisan 
--	IF @status = 2 AND @fakturisano = 0
--		SET @rez = 2
--	--3 Fakturisan
--	IF @status = 2 AND @fakturisano > 0
--		SET @rez = 3
--	--4 Naplacen
--	IF @status = 2 AND @fakturisano > 0 AND @uplaceno > 0
--		SET @rez = 4
	
--	RETURN @rez
--END

--GO
--ALTER TABLE tRadniNalog ADD StatusNaloga AS dbo.StatusNaloga(Id) 


--GO

--SELECT	 * FROM tRadniNalogStatus rns