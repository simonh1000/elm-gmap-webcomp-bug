module Main exposing (main)

import Browser
import Browser.Navigation exposing (Key)
import Html exposing (..)
import Html.Attributes as Attribute exposing (..)
import Html.Events exposing (onClick)
import Http exposing (Error(..))
import Json.Decode as Decode
import Url exposing (Url)



-- ---------------------------
-- MODEL
-- ---------------------------


type alias Model =
    { message : String
    , key : String
    }


blankModel : Model
blankModel =
    { message = "init", key = "" }


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
            ( { model | message = "clicked" }, Cmd.none )

        NoOp ->
            ( model, Cmd.none )



-- ---------------------------
-- VIEW
-- ---------------------------


view : Model -> List (Html Msg)
view model =
    [ div [ class "message" ] [ text model.message ]
    , gmap 39.2 -0.45
    ]


gmap lat lng =
    Html.node "af-map"
        [ Attribute.attribute "api-key" "AIzaSyDPGdhFftpVU-QW4ihbXi6IuLw1DUriYJ0"
        , Attribute.attribute "latitude" <| String.fromFloat lat
        , Attribute.attribute "longitude" <| String.fromFloat lng
        , Attribute.attribute "zoom" "10"
        ]
        [ mkMarker lat lng ]


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
