module Main exposing (main)

import Browser
import Browser.Navigation exposing (Key)
import Html exposing (..)
import Html.Attributes as Attribute exposing (..)
import Html.Events exposing (onClick)
import Http exposing (Error(..))
import Json.Decode as Decode
import Url exposing (Url)


valencia =
    { lat = 39.4, lng = -0.45 }


type alias LatLng =
    { lat : Float, lng : Float }



-- ---------------------------
-- MODEL
-- ---------------------------


type alias Model =
    { message : String
    , key : String
    , location : List LatLng
    }


blankModel : Model
blankModel =
    { message = "init", key = "", location = [ valencia ] }


init : String -> ( Model, Cmd Msg )
init key =
    ( { blankModel | key = key }, Cmd.none )



-- ---------------------------
-- UPDATE
-- ---------------------------


type Msg
    = Click
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        Click ->
            ( { model
                | message = "clicked"
                , location = { lat = 39.5, lng = -0.45 } :: model.location
              }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )



-- ---------------------------
-- VIEW
-- ---------------------------


view : Model -> List (Html Msg)
view model =
    [ button [ onClick Click ] [ text "click" ]
    , div [ class "message" ] [ text model.message ]
    , model.location
        |> List.map (\{ lat, lng } -> mkMarker lat lng)
        |> gmap
    ]


gmap kids =
    Html.node "af-map"
        [ Attribute.attribute "api-key" "AIzaSyDPGdhFftpVU-QW4ihbXi6IuLw1DUriYJ0"
        , Attribute.attribute "latitude" <| String.fromFloat valencia.lat
        , Attribute.attribute "longitude" <| String.fromFloat valencia.lng
        , Attribute.attribute "zoom" "10"
        ]
    <|
        div [ id "map" ] []
            :: kids


mkMarker lat lng =
    Html.node "af-marker"
        [ Attribute.attribute "latitude" <| String.fromFloat lat
        , Attribute.attribute "longitude" <| String.fromFloat lng
        ]
        []



-- ---------------------------
-- MAIN
-- ---------------------------


main =
    Browser.document
        { init = init
        , update = update
        , view =
            \m ->
                { title = "Elm 0.19 starter"
                , body = view m
                }
        , subscriptions = \_ -> Sub.none
        }
