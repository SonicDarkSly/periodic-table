"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AtomAnimation from "../../../components/AtomAnimation";
import Navigations from "../../../components/Navigations";
import axios from "axios";

interface Element {
  electronLayers: number[];
  atomicNumber: number;
  symbol: string;
  atomicMass: number;
  electronicConfiguration: string;
  electronegativity: number;
  atomicRadius: number;
  ionRadius: number;
  vanDerWaalsRadius: number;
  ionizationEnergy: number;
  electronAffinity: number;
  oxidationStates: string;
  standardState: string;
  bondingType: string;
  meltingPoint: number;
  boilingPoint: number;
  density: number;
  groupBlock: string;
  yearDiscovered: number;
  block: string;
  cpkHexColor: string;
  period: number;
  group: number;
  protons: number;
  neutrons: number;
  electrons: number;
  name: string;
}

const ElementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [element, setElement] = useState<Element | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stopAnim, setStopAnim] = useState<boolean>(true); 

  const fetchElement = async (id: string | string[] | undefined) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/elements/getOneElement?number=${id}`,
      );
      setElement(response.data);
    } catch (error: any) {
      console.error(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayKey = (key: keyof Element): string => {
    const keyMappings: Record<keyof Element, string> = {
      electronLayers: "Structure électronique",
      atomicNumber: "Numéro Atomique",
      symbol: "Symbole",
      atomicMass: "Masse Atomique",
      electronicConfiguration: "Configuration Électronique",
      electronegativity: "Électronégativité",
      atomicRadius: "Rayon Atomique",
      ionRadius: "Rayon Ionique",
      vanDerWaalsRadius: "Rayon de van der Waals",
      ionizationEnergy: "Énergie d'Ionisation",
      electronAffinity: "Affinité Électronique",
      oxidationStates: "États d'Oxydation",
      standardState: "État Standard",
      bondingType: "Type de Liaison",
      meltingPoint: "Point de Fusion",
      boilingPoint: "Point d'Ébullition",
      density: "Densité",
      groupBlock: "Bloc du Groupe",
      yearDiscovered: "Année de Découverte",
      block: "Bloc",
      cpkHexColor: "Couleur CPK en Hex",
      period: "Période",
      group: "Groupe",
      protons: "Protons",
      neutrons: "Neutrons",
      electrons: "Électrons",
      name: "Nom",
    };
    return keyMappings[key] || key;
  };

  const renderKeyValueRow = (
    key: keyof Element,
    value: string | number | string[] | null,
  ) => (
    <tr key={key}>
      <td>{getDisplayKey(key)}</td>
      <td>
        {key === "electronLayers" ? (value as string[]).join(", ") : value}
      </td>
    </tr>
  );

  useEffect(() => {
    if (id) {
      fetchElement(id.toString());
    }
  }, [id]);

  return (
    <div className="page-element">
      <div className="header">
        <h1>Fiche pour {element?.name}</h1>
      </div>

      <Navigations id={parseInt(id as string)} />

      <div className="body">
        {error ? (
          <div className="container">
            <p className="error">{error}</p>
          </div>
        ) : (
          <div className="container">
            {loading ? (
              <div className="loading">Chargement...</div>
            ) : (
              <>
                {element && (
                  <AtomAnimation
                    protonCount={element.protons}
                    neutronCount={element.neutrons}
                    electronCount={element.electrons}
                    elementData={element}
                    animation={stopAnim}
                  />
                )}

                <div className="informations">
                  <div>
                    <button onClick={() => setStopAnim(!stopAnim)}>Stop</button>
                    {stopAnim ? "true" : "false"}
                  </div>
                  <table className="element-table">
                    <tbody>
                      {element &&
                        Object.entries(element).map(([key, value]) =>
                          renderKeyValueRow(key as keyof Element, value),
                        )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementPage;
