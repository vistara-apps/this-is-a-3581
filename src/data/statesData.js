export const statesData = {
  CA: {
    name: 'California',
    rightsContent: {
      en: {
        sections: [
          {
            type: 'traffic',
            title: 'Traffic Stops',
            subtitle: 'What to know when pulled over',
            whatToDo: [
              'Pull over safely and turn off engine',
              'Keep hands visible on steering wheel',
              'Provide license, registration, and insurance when asked',
              'You may remain silent beyond identifying yourself',
              'Ask if you are free to leave'
            ],
            whatNotToDo: [
              'Don\'t get out of vehicle unless asked',
              'Don\'t reach for documents until instructed',
              'Don\'t argue or resist',
              'Don\'t consent to searches without a warrant'
            ],
            keyPoints: [
              'California requires you to identify yourself during traffic stops',
              'You can refuse consent to search your vehicle',
              'Recording is legal as long as it doesn\'t interfere'
            ]
          },
          {
            type: 'search',
            title: 'Search & Seizure',
            subtitle: 'Your Fourth Amendment rights',
            whatToDo: [
              'Clearly state: "I do not consent to searches"',
              'Ask if they have a warrant',
              'Ask what crime you\'re suspected of',
              'Remember or record badge numbers and patrol car numbers'
            ],
            whatNotToDo: [
              'Don\'t physically resist even if search is illegal',
              'Don\'t give permission for searches',
              'Don\'t answer questions about where you\'ve been'
            ],
            keyPoints: [
              'Police need probable cause or a warrant to search',
              'Plain view doctrine allows seizure of visible contraband',
              'You can be patted down for weapons during investigative stops'
            ]
          },
          {
            type: 'arrest',
            title: 'Arrest Situations',
            subtitle: 'If you are being arrested',
            premium: true,
            whatToDo: [
              'Say clearly: "I am invoking my right to remain silent"',
              'Ask for a lawyer immediately',
              'Remember details of the arrest',
              'Cooperate physically but assert your rights verbally'
            ],
            whatNotToDo: [
              'Don\'t resist arrest even if you believe it\'s unlawful',
              'Don\'t make any statements without a lawyer present',
              'Don\'t sign anything except citations'
            ],
            keyPoints: [
              'You have the right to remain silent',
              'You have the right to an attorney',
              'You can make one phone call'
            ]
          }
        ]
      },
      es: {
        sections: [
          {
            type: 'traffic',
            title: 'Paradas de Tráfico',
            subtitle: 'Qué saber cuando te detienen',
            whatToDo: [
              'Deténgase de manera segura y apague el motor',
              'Mantenga las manos visibles en el volante',
              'Proporcione licencia, registro y seguro cuando se lo pidan',
              'Puede permanecer en silencio más allá de identificarse',
              'Pregunte si es libre de irse'
            ],
            whatNotToDo: [
              'No salga del vehículo a menos que se lo pidan',
              'No busque documentos hasta que se lo indiquen',
              'No discuta ni se resista',
              'No consienta registros sin una orden judicial'
            ],
            keyPoints: [
              'California requiere que se identifique durante paradas de tráfico',
              'Puede rechazar el consentimiento para registrar su vehículo',
              'Grabar es legal siempre que no interfiera'
            ]
          }
        ]
      }
    },
    scripts: {
      en: {
        categories: [
          {
            name: 'Traffic Stop Scripts',
            scripts: [
              {
                situation: 'When asked for documents',
                description: 'Polite compliance while asserting awareness',
                text: 'Officer, I\'m reaching for my license and registration now. They are in my glove compartment.',
                tone: 'polite',
                note: 'Always announce your movements'
              },
              {
                situation: 'When asked about consent to search',
                description: 'Clearly declining search permission',
                text: 'Officer, I do not consent to any searches of my person or vehicle. I am exercising my Fourth Amendment rights.',
                tone: 'firm',
                note: 'Be clear and direct'
              },
              {
                situation: 'When asked where you\'re going',
                description: 'Exercising right to remain silent',
                text: 'Officer, I\'m exercising my right to remain silent. Am I free to leave?',
                tone: 'polite'
              }
            ]
          },
          {
            name: 'General Encounter Scripts',
            scripts: [
              {
                situation: 'Initial contact',
                description: 'Establishing you know your rights',
                text: 'Officer, I want to be cooperative. I\'m going to remain silent and I\'d like to speak with a lawyer.',
                tone: 'polite'
              },
              {
                situation: 'When recording',
                description: 'Informing officer of recording',
                text: 'Officer, I am recording this interaction for both of our protection. This is my legal right.',
                tone: 'firm',
                premium: true
              }
            ]
          }
        ]
      },
      es: {
        categories: [
          {
            name: 'Scripts de Parada de Tráfico',
            scripts: [
              {
                situation: 'Cuando piden documentos',
                description: 'Cumplimiento cortés mientras afirma conciencia',
                text: 'Oficial, voy a buscar mi licencia y registro ahora. Están en mi guantera.',
                tone: 'polite',
                note: 'Siempre anuncie sus movimientos'
              }
            ]
          }
        ]
      }
    }
  },
  
  NY: {
    name: 'New York',
    rightsContent: {
      en: {
        sections: [
          {
            type: 'traffic',
            title: 'Traffic Stops',
            subtitle: 'New York specific requirements',
            whatToDo: [
              'Pull over safely and turn off engine',
              'Keep hands visible',
              'Provide license and registration when requested',
              'You must identify yourself when lawfully detained'
            ],
            whatNotToDo: [
              'Don\'t exit vehicle unless instructed',
              'Don\'t make sudden movements',
              'Don\'t consent to searches'
            ],
            keyPoints: [
              'New York has stop-and-identify laws',
              'Recording police is legal in public spaces',
              'You can refuse consent to vehicle searches'
            ]
          }
        ]
      }
    },
    scripts: {
      en: {
        categories: [
          {
            name: 'NY Traffic Scripts',
            scripts: [
              {
                situation: 'Document request',
                text: 'Officer, I\'m reaching for my documents in my wallet. Here is my license and registration.',
                tone: 'polite'
              }
            ]
          }
        ]
      }
    }
  },

  TX: {
    name: 'Texas',
    rightsContent: {
      en: {
        sections: [
          {
            type: 'traffic',
            title: 'Traffic Stops',
            subtitle: 'Texas traffic stop procedures',
            whatToDo: [
              'Pull over promptly and safely',
              'Turn off engine and lower window',
              'Keep hands on steering wheel',
              'Provide required documents when asked'
            ],
            whatNotToDo: [
              'Don\'t get out unless ordered to do so',
              'Don\'t reach for anything without permission',
              'Don\'t argue about the stop'
            ],
            keyPoints: [
              'Texas requires identification during lawful detention',
              'Concealed carry holders must disclose if armed',
              'Recording police is generally legal'
            ]
          }
        ]
      }
    },
    scripts: {
      en: {
        categories: [
          {
            name: 'Texas Scripts',
            scripts: [
              {
                situation: 'Concealed carry disclosure',
                text: 'Officer, I want to let you know that I have a concealed handgun license and I am/am not currently carrying.',
                tone: 'polite',
                note: 'Required by Texas law'
              }
            ]
          }
        ]
      }
    }
  },

  FL: {
    name: 'Florida',
    rightsContent: {
      en: {
        sections: [
          {
            type: 'traffic',
            title: 'Traffic Stops',
            subtitle: 'Florida traffic encounter rules',
            whatToDo: [
              'Pull over safely',
              'Turn off vehicle',
              'Keep hands visible',
              'Provide license, registration, and proof of insurance'
            ],
            whatNotToDo: [
              'Don\'t exit vehicle without permission',
              'Don\'t consent to searches',
              'Don\'t make sudden movements'
            ],
            keyPoints: [
              'Florida has stop-and-identify requirements',
              'You may record police interactions',
              'Search consent can be withdrawn at any time'
            ]
          }
        ]
      }
    },
    scripts: {
      en: {
        categories: [
          {
            name: 'Florida Scripts',
            scripts: [
              {
                situation: 'Search refusal',
                text: 'Officer, I do not consent to any search of my vehicle or person. I am exercising my constitutional rights.',
                tone: 'firm'
              }
            ]
          }
        ]
      }
    }
  }
}

// Add more states as needed
Object.keys(statesData).forEach(state => {
  if (!statesData[state].scripts.es) {
    statesData[state].scripts.es = {
      categories: [
        {
          name: 'Scripts Básicos',
          scripts: [
            {
              situation: 'Contacto inicial',
              text: 'Oficial, quiero cooperar. Voy a permanecer en silencio y me gustaría hablar con un abogado.',
              tone: 'polite'
            }
          ]
        }
      ]
    }
  }
})