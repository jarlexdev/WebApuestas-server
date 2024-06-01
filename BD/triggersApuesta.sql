DELIMITER //
-- trigger para llenar puntos automaticamente
CREATE TRIGGER llenarPuntosUser BEFORE INSERT ON Usuarios
FOR EACH ROW
BEGIN
    IF NEW.puntosUser IS NULL THEN
        SET NEW.puntosUser = 100;
    END IF;
END//
DELIMITER ;

DELIMITER $$
CREATE TRIGGER tr_set_fecha_fundacion_visitante
BEFORE INSERT ON EquipoVisitante
FOR EACH ROW
BEGIN
    SET NEW.fechaFundacionVisitante = CURRENT_DATE();
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER tr_set_fecha_fundacion_local
BEFORE INSERT ON EquipoLocal
FOR EACH ROW
BEGIN
    SET NEW.fechaFundacionLocal = CURRENT_DATE();
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER tr_set_fecha_apuesta
BEFORE INSERT ON Apuestas
FOR EACH ROW
BEGIN
    SET NEW.fechaApuesta = CURRENT_DATE();
END$$
DELIMITER ;